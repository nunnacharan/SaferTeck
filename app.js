const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5050;

// Middleware
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes

// Create File
app.post('/createFile', (req, res) => {
  const { filename, content, password } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ error: 'Filename and content are required' });
  }

  if (password && typeof password !== 'string') {
    return res.status(400).json({ error: 'Password must be a string' });
  }

  const filePath = path.join(__dirname, filename);
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create file' });
    }
    res.status(200).send();
  });
});

// Read File
app.get('/getFile/:filename', (req, res) => {
  const { filename } = req.params;
  const { password } = req.query;

  if (!password) {
    return res.status(401).json({ error: 'Password is required to access this file' });
  }

  const filePath = path.join(__dirname, filename);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(400).json({ error: 'File not found' });
    }
    res.json({ content: data });
  });
});

// Update File
app.put('/updateFile/:filename', (req, res) => {
  const { filename } = req.params;
  const { content, password } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required for updating file' });
  }

  if (!password) {
    return res.status(401).json({ error: 'Password is required to update this file' });
  }

  // Example: Check if password is correct (replace this with your actual password validation logic)
  const correctPassword = 'your_password';
  if (password !== correctPassword) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const filePath = path.join(__dirname, filename);
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update file' });
    }
    res.status(200).send();
  });
});



​
app.delete('/deleteFile', async (req, res) => {
  const { filename, password } = req.body;
  if (!filename) {
    return res.status(400).send('Filename parameter is required.');
  }

  if (password !== 'optionalPassword') {
    return res.status(401).send('Unauthorized');
  }

  try {
    await fs.unlink(filename);
    res.sendStatus(200);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(400).send('File not found');
    }
    console.error('Error deleting file:', err);
    res.status(500).send('Internal Server Error');
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
