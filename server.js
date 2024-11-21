const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const Blog = require('./models/Blog');

// MongoDB Atlas URI
const uri = "mongodb+srv://shashinarmala29:LcnEks3kuaQLxgoH@cluster.go8c4.mongodb.net/blogDB?retryWrites=true&w=majority";

const app = express();

// Connect to MongoDB Atlas
mongoose.connect(uri)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Use express-session for session management
app.use(session({
  secret: 'adminsecret',
  resave: false,
  saveUninitialized: true,
}));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Parse JSON request body

// Routes

// Homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Projects route (links to blog page)
// Projects route (links to blog page)
app.get('/projects', async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch blogs from MongoDB
    let blogListHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Projects</title>
          <link rel="stylesheet" href="/projects.css"> <!-- Link to the new projects.css -->
        </head>
        <body>
          <header>
            <div class="navbar">
              <a href="/" class="logo">Tech Folio</a>
              <nav>
                <a href="/">Home</a>
                <a href="/projects" class="active">Projects</a>
                <a href="/newsletter">Newsletter</a>
              </nav>
            </div>
          </header>
          <main>
            <section class="project-section">
              <h1>Our Projects</h1>
              <div class="projects-grid">
    `;

    if (blogs.length > 0) {
      blogs.forEach(blog => {
        blogListHtml += `
          <div class="project-card">
            <img src="${blog.coverImage}" alt="Cover Image" class="project-image"> <!-- Add the cover image -->
            <div class="project-content">
              <h2 class="project-title">${blog.title}</h2>
              <p class="project-description">${blog.description}</p>
              <a href="/blog/${blog.slug}" class="project-link">Read More</a>
            </div>
          </div>
        `;
      });
    } else {
      blogListHtml += '<p>No projects found.</p>';
    }

    blogListHtml += `</div></section></main>`;
    
    if (req.session.loggedIn) {
      blogListHtml += `
        <div class="admin-actions">
          <a href="/admin-dashboard" class="button">Admin Dashboard</a>
          <a href="/logout" class="button">Logout</a>
        </div>
      `;
    } else {
      blogListHtml += '<a href="/admin-login" class="button">Admin Login</a>';
    }

    blogListHtml += `</body></html>`;
    res.send(blogListHtml); // Send the complete HTML
  } catch (err) {
    res.status(500).json({ error: 'Error fetching blogs', details: err });
  }
});


// Newsletter route
app.get('/newsletter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'newsletter.html'));  // Adjust based on your actual file structure
});

// Admin login route
app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));  // Add your login page HTML
});

// Admin authentication route
app.post('/admin-login', (req, res) => {
  const { username, password } = req.body;

  // Dummy credentials for login
  if (username === 'admin' && password === 'admin123') {
    req.session.loggedIn = true;
    res.redirect('/admin-dashboard');  // Redirect to dashboard after login
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Admin dashboard route (only accessible after login)
app.get('/admin-dashboard', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));  // Add your dashboard page HTML
  } else {
    res.redirect('/admin-login');  // Redirect to login if not logged in
    res.status(401).json({ message: "inavlid credentials"})
  }
});

// Logout route (clear session)
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.redirect('/');
  });
});

// Start server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
