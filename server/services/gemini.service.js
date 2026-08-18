const { GoogleGenAI } = require("@google/genai");

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

const createEmbeddings = async (texts = []) => {
  const BATCH_SIZE = 50;
  const embeddings = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const response = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: batch.map((text) => ({
        parts: [{ text }],
      })),
    });

    embeddings.push(...response.embeddings.map((embedding) => embedding.values));
  }

  return embeddings;
};

module.exports = {
  ai,
  createEmbedding,
  createEmbeddings,
};
