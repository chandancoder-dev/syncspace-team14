import mongoose from "mongoose";

const yjsUpdateLogSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    // Binary Yjs update (individual delta, not full state)
    update: {
      type: Buffer,
      required: true,
    },
    // Who made this edit
    userId: {
      type: String,
      default: null,
    },
    userName: {
      type: String,
      default: "Anonymous",
    },
    // Timestamp of the edit
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    // No updatedAt needed — these are immutable log entries
    timestamps: false,
  }
);

// Compound index for efficient replay queries (room + chronological order)
yjsUpdateLogSchema.index({ roomId: 1, timestamp: 1 });

const YjsUpdateLog = mongoose.model("YjsUpdateLog", yjsUpdateLogSchema);

export default YjsUpdateLog;
