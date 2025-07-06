import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  quest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quest",
    require: true,
  },
  repoUrl: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  score: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Submission", submissionSchema);
