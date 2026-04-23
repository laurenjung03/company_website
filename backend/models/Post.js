const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    fileUrl: { type: [String], trim: true },
    views: { type: Number, default: 0 },
    viewLogs: [
      {
        ip: String,
        userAgent: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        //이중 조회수 방지
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
//내용, 조회수,파일,작성일,수정일,관리
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
