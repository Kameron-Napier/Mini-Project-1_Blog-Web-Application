import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

let posts = [];
let postIdCounter = 1;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home page
app.get('/', (req, res) => {
    const allPosts = posts.slice().reverse();
    res.render('index', {
        posts: allPosts,
    });
});

// add new post page
app.get('/add', (req, res) => {
    res.render('add');
});

// handle adding a new post
app.post('/add', (req, res) => {
    const date = new Date();
    const currentDay = date.toLocaleDateString('en-UK', { year: 'numeric', month: 'long', day: 'numeric' });

    const body = req.body.body.replace(/(?:\r\n|\r|\n)/g, '<br />');
    const post = {
        id: postIdCounter++,
        title: req.body.title,
        body: body,
        date: currentDay,
    }
    
    posts.push(post);
    res.redirect('/');
});

// edit post page
app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    res.render('edit', { post });
});

// handle editing a post
app.post('/edit', (req, res) => {
    const postId = parseInt(req.body.id);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex > -1) {
        posts[postIndex].title = req.body.title;
        posts[postIndex].body = req.body.body.replace(/(?:\r\n|\r|\n)/g, '<br />');
        res.render('edit', { post: posts[postIndex], successMessage: 'The post has been edited successfully.' });
    } else {
        res.render('edit', { errorMessage: 'Post not found.' });
    }
});

// handle deleting a post
app.get('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== postId);
    res.redirect('/');
});

// start the server
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
