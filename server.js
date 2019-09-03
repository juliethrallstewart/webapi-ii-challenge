const express = require('express');

const server = express();

server.use(express.json());

const db = require('./data/db.js');

server.get('/', (req, res) => {
	res.send('server is listening');
});

server.get('/api/posts/', (req, res) => {
	const posts = req.body;

	db
		.find()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(e => {
			res.status(500).json({ errorMessage: 'error retrieving posts' });
		});
});

server.get('/api/posts/:id/comments', (req, res) => {
	const postId = req.params.id;

	db
		.findPostComments(postId)
		.then(post => {
			console.log(post, 'this is the post');
			let list = [];
			post.filter(item => list.push(item.text));
			res.status(200).json(list);
		})
		.catch(e => {
			res.status(500).json({ errorMessage: 'error retrieving post' });
		});
});

server.get('/api/posts/:id', (req, res) => {
	const { id } = req.params;
	console.log(id);

	db
		.findCommentById(id)
		.then(post => {
			res.status(200).json(post);
		})
		.catch(e => {
			res.status(500).json({ errorMessage: 'error retrieving posts' });
		});
});

server.post('/api/posts', (req, res) => {
	const newPost = req.body;
	db
		.insert(newPost)
		.then(post => {
			res.status(200).json(post);
		})
		.catch(e => {
			res.status(500).json({ erroMessage: 'unable to add post' });
		});
});

module.exports = server;
