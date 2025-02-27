const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log("Request received");
    next();
});

// Set up EJS as the template engine
app.set('view engine', 'ejs');

// Middleware to parse POST request data
app.use(bodyParser.urlencoded({ extended: false }));

// Route to get all posts
app.get('/posts', (req, res) => {
    fs.readFile('posts.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading posts data');
            return;
        }

        const posts = JSON.parse(data);
        res.render('index', { posts });
    });
});

// Route to get a single post by ID
app.get('/post', (req, res) => {
    const postId = req.query.id;
    if (!postId) {
        res.status(400).send('Post ID is required');
        return;
    }

    fs.readFile('posts.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading posts data');
            return;
        }

        const posts = JSON.parse(data);
        const post = posts.find((p) => p.id == postId);

        if (!post) {
            res.status(404).send('Post not found');
            return;
        }

        res.render('post', { post });
    });
});

// Route to render form to add a new post
app.get('/add-post', (req, res) => {
    res.render('add-post');
});

// Route to handle the form submission for adding a new post
app.post('/add-post', (req, res) => {
    const { title, content } = req.body;
    
    if (!title || !content) {
        res.status(400).send('Title and content are required');
        return;
    }

    fs.readFile('posts.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading posts data');
            return;
        }

        const posts = JSON.parse(data);
        const newPost = {
            id: posts.length + 1,
            title,
            content,
        };

        posts.push(newPost);

        fs.writeFile('posts.json', JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                res.status(500).send('Error saving post');
                return;
            }

            res.redirect('/posts');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
