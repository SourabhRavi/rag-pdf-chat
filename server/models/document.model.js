const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  guestId: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now(),
  },
});

documentSchema.index({
  guestId: 1,
  documentId: 1,
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
