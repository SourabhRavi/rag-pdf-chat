const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { randomUUID } = require("crypto");
const { PDFParse } = require("pdf-parse");

const Document = require("../models/document.model");
const { createEmbeddings } = require("../services/gemini.service");
const qdrantClient = require("../services/qdrant.service");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

const guestMiddleware = require("../middleware/guest.middleware");

router.post("/upload", guestMiddleware, upload.single("pdf"), async (req, res) => {
  const CHUNK_SIZE = 2000;
  const CHUNK_OVERLAP = 500;

  try {
    const guestId = req.guest.guestId;

    const dataBuffer = fs.readFileSync(req.file.path);
    const parser = new PDFParse({
      data: dataBuffer,
    });
    const result = await parser.getText();
    const text = result.text;

    await parser.destroy();

    const chunks = [];

    for (let i = 0; i < text.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
      const chunk = text.slice(i, i + CHUNK_SIZE);

      if (chunk) {
        chunks.push(chunk);
      }
    }

    const documentId = randomUUID();

    const embeddings = await createEmbeddings(
      chunks.map((chunk) => `title: none | text: ${chunk}`),
    );

    const chunkEmbeddings = chunks.map((chunk, index) => ({
      text: chunk,
      embedding: embeddings[index],
    }));

    const points = chunkEmbeddings.map((item, index) => ({
      id: randomUUID(),
      vector: item.embedding,
      payload: {
        documentId,
        guestId,
        fileName: req.file.originalname,
        text: item.text,
        chunkIndex: index,
      },
    }));

    await qdrantClient.upsert("pdf-docs", {
      points,
    });

    await Document.create({
      documentId,
      fileName: req.file.originalname,
      guestId,
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

router.get("/", guestMiddleware, async (req, res) => {
  try {
    const guestId = req.guest.guestId;

    const documents = await Document.find({
      guestId,
    })
      .sort({ uploadedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully.",
      data: {
        documents,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents.",
    });
  }
});

router.get("/:documentId", guestMiddleware, async (req, res) => {
  try {
    const { documentId } = req.params;
    const guestId = req.guest.guestId;

    const document = await Document.findOne({ documentId, guestId }).lean();

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

router.delete("/:documentId", guestMiddleware, async (req, res) => {
  try {
    const { documentId } = req.params;
    const guestId = req.guest.guestId;

    const document = await Document.findOne({
      guestId,
      documentId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    await qdrantClient.delete("pdf-docs", {
      filter: {
        must: [
          {
            key: "guestId",
            match: [
              {
                value: guestId,
              },
            ],
          },
          {
            key: "documentId",
            match: {
              value: documentId,
            },
          },
        ],
      },
    });

    await Document.deleteOne({
      guestId,
      documentId,
    });

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete document.",
    });
  }
});

module.exports = router;
