const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: [{ type: String, required: true }],
  slug: { type: String, required: true, unique: true },
  coverImage: { type: String, required: true },  // Cover image URL
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
