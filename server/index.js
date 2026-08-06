const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { randomUUID } = require("crypto");
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
const { QdrantClient } = require("@qdrant/js-client-rest");
const cors = require("cors");
require("dotenv").config();

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

    res.send("Collection is created");
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

    // const searchResult = await qdrantClient.query("pdf-docs", {
    //   query: questionEmbedding,
    //   limit: 1,
    //   with_payload: true,
    // });

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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `Explain the question using the context: ${bestChunk} and question is: ${question}`,
    });

    res.status(200).json({
      success: true,
      message: response.text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
