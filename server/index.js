const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
const { QdrantClient } = require("@qdrant/js-client-rest");
require("dotenv").config();

const app = express();

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

// const cosineSimilarity = (vecA, vecB) => {
//   let dotProduct = 0;
//   for (let i = 0; i < vecA.length; i++) {
//     dotProduct += vecA[i] * vecB[i];
//   }

//   return dotProduct;
// };

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
  console.log(req.body);

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    const chunks = text.split("\n\n").filter((chunk) => chunk.trim() !== "");
    // console.log(chunks);

    const chunkEmbeddings = [];

    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk);
      chunkEmbeddings.push({
        text: chunk,
        embedding,
      });
    }

    const points = chunkEmbeddings.map((item, index) => ({
      id: index + 1,
      vector: item.embedding,
      payload: {
        text: item.text,
      },
    }));

    await qdrantClient.upsert("pdf-docs", {
      points,
    });

    const question = req.body.question;
    const questionEmbedding = await createEmbedding(question);
    let bestChunk = null;

    const searchResult = await qdrantClient.query("pdf-docs", {
      query: questionEmbedding,
      limit: 1,
      with_payload: true,
    });

    // console.log("Search result", searchResult);
    console.dir(searchResult, { depth: null });
    bestChunk = searchResult.points[0].payload.text;

    // let bestScore = -Infinity;

    // for (const items of chunkEmbeddings) {
    //   const score = cosineSimilarity(questionEmbedding, items.embedding);

    //   if (score > bestScore) {
    //     bestChunk = items.text;
    //     bestScore = score;
    //   }
    // }

    // console.log("best score", bestScore);
    // console.log("best chunk", bestChunk);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `Explain the question using the context: ${bestChunk} and question is: ${question}`,
    });

    res.send(response.text);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
