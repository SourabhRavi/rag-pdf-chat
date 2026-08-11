const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { randomUUID } = require("crypto");
const pdfParse = require("pdf-parse");

const Document = require("../models/document.model");
const { createEmbedding } = require("../services/gemini.service");
const qdrantClient = require("../services/qdrant.service");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("pdf"), async (req, res) => {
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

router.get("/:documentId", async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findOne({ documentId }).lean();

    if (!document) {
      return res.status(404).json({
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

module.exports = router;
