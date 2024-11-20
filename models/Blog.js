// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: { type: [String] },
  imageUrl: { type: String },
  slug: { type: String, unique: true }
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
