import mongoose from "mongoose";

const yjsDocumentSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Binary Yjs document state (stored as Buffer)
    state: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const YjsDocument = mongoose.model("YjsDocument", yjsDocumentSchema);

export default YjsDocument;
