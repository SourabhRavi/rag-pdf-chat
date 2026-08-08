const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { randomUUID } = require("crypto");
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
const { QdrantClient } = require("@qdrant/js-client-rest");
const cors = require("cors");
require("dotenv").config();
const Document = require("./models/document.model");

const connectDB = require("./config/db");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

const upload = multer({ dest: "uploads/" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const createEmbedding = async (text) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
  });

  return response.embeddings[0].values;
};

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Hey I am Sourabh");
});

app.get("/create-collection", async (req, res) => {
  try {
    await qdrantClient.createCollection("pdf-docs", {
      vectors: {
        size: 3072,
        distance: "Cosine",
      },
    });

    await qdrantClient.createPayloadIndex("pdf-docs", {
      field_name: "documentId",
      field_schema: "keyword",
    });

    return res.status(200).json({
      success: true,
      message: "Qdrant collection created successfully.",
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    const chunks = text.split("\n\n").filter((chunk) => chunk.trim() !== "");

    const documentId = randomUUID();

    const chunkEmbeddings = [];

    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk);
      chunkEmbeddings.push({
        text: chunk,
        embedding,
      });
    }

    const points = chunkEmbeddings.map((item) => ({
      id: randomUUID(),
      vector: item.embedding,
      payload: {
        documentId,
        fileName: req.file.originalname,
        text: item.text,
      },
    }));

    await qdrantClient.upsert("pdf-docs", {
      points,
    });

    await Document.create({
      documentId,
      fileName: req.file.originalname,
    });

    return res.status(200).json({
      success: true,
      message: "PDF uploaded successfully",
      data: {
        documentId,
        fileName: req.file.originalname,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "File upload failed. Please retry in sometime.",
    });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { documentId, question } = req.body;
    const questionEmbedding = await createEmbedding(question);
    let bestChunk = null;

    const searchResult = await qdrantClient.query("pdf-docs", {
      query: questionEmbedding,
      limit: 1,
      with_payload: true,
      filter: {
        must: [
          {
            key: "documentId",
            match: {
              value: documentId,
            },
          },
        ],
      },
    });

    bestChunk = searchResult.points[0].payload.text;

    // for full content after generation
    // const response = await ai.models.generateContent({
    //   model: "gemini-3.5-flash-lite",
    //   contents: `Explain the question using the context: ${bestChunk} and question is: ${question}`,
    // });

    // for content streaming
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash-lite",
      contents: `Explain the question using the context: ${bestChunk} and question is: ${question}`,
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of responseStream) {
      // console.log(chunk.text);
      res.write(chunk.text);
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.get("/document/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findOne({ documentId }).lean();

    if (!document) {
      res.status(404).json({
        success: false,
        message: "Internal Server error",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document found.",
      data: document,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
});

const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();
