const qdrantClient = require("../services/qdrant.service");

const setupQdrant = async () => {
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

    await qdrantClient.createPayloadIndex("pdf-docs", {
      field_name: "guestId",
      field_schema: "keyword",
    });

    console.log("Qdrant collection and payload indexes created successfully.");
  } catch (err) {
    console.error("Qdrant setup failed:", err);
    process.exit(1);
  }
};

setupQdrant();
