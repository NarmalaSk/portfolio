const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: String,
  description: String,
  slug: String,
  coverImage: {
    type: String,
    default: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1729865212777/27993222-b7c9-4956-96b8-7192e6a11f71.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp',
  },
});

module.exports = mongoose.model('Blog', BlogSchema);
