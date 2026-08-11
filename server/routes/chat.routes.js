const express = require("express");

const { createEmbedding } = require("../services/gemini.service");
const qdrantClient = require("../services/qdrant.service");

const router = express.Router();

router.post("/chat", async (req, res) => {
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

    // for content streaming
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash-lite",
      contents: `Explain the question using the context: ${bestChunk} and question is: ${question}`,
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of responseStream) {
      res.write(chunk.text);
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
