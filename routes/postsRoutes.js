const express = require('express');
const router = express.Router();

// const server = express();
// server.use(express.json());

//inport database
const db = require('../data/db.js');

// router.get('/', (req, res) => {
// 	res.send('server is listening');
// });

// gets all the posts - Working
router.get('/', (req, res) => {
	const posts = req.body;

	db
		.find()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(e => {
			res.status(500).json({ error: 'The posts information could not be retrieved.' });
		});
});

// gets post by id - Working
router.get('/:id', (req, res) => {
	const id = req.params.id;

	db
		.findById(id)
		.then(post => {
			console.log(post);
			if (post.length === 0) {
				return res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			}

			res.status(200).json(post);
		})
		.catch(error => {
			res.status(500).json({ error: 'The post information could not be retrieved.' });
		});
});

// gets list of all posts that share the same comments - Working

router.get('/:id/comments', (req, res) => {
	const postId = req.params.id;
	console.log(postId);

	db
		.findPostComments(postId)
		.then(comments => {
			console.log(comments.length);
			if (comments.length === 0) {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			}
			res.status(200).json(comments);
		})
		.catch(e => {
			res.status(500).json({ errorMessage: 'error retrieving comments' });
		});
});

//add a new post that returns the new post, uses destructuring - working

// router.post('/', (req, res) => {
// 	const newPost = req.body;
// 	const { title, contents } = req.body;
// 	console.log(newPost);
// 	if (!title || !contents) {
// 		return res.status(400).json({ error: 'Requires title and contents' });
// 	}
// 	else {
// 		db
// 			.insert({ title, contents })
// 			.then(({ id }) => {
// 				db
// 					.findById(id)
// 					.then(post => {
// 						res.status(201).json(post);
// 					})
// 					.catch(e => {
// 						res.status(500).json({ error: 'There was an error while retrieving the post' });
// 					});
// 			})
// 			.catch(e => {
// 				res.status(500).json({ error: 'There was an error while saving the post to the database' });
// 			});
// 	}
// });

// adds a new post, returns ID of the new post - WORKING
router.post('/', (req, res) => {
	const newPost = req.body;
	console.log(newPost);
	if (!newPost.title || !newPost.contents) {
		return res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
	}
	else {
		db
			.insert(newPost)
			.then(post => {
				res.status(201).json(post);
			})
			.catch(error => {
				res.status(500).json({ error: 'There was an error while saving the post to the database' });
			});
	}
});

// adds a new comment - NOT WORKING
router.post('/:id/comments', (req, res) => {
	const postId = req.params.id;
	const comment = req.body;

	comment.post_Id = postId;

	console.log(comment);
	if (!comment) {
		res.status(404).json({ message: 'Please provide text for the comment' });
	}
	db
		.findById(postId)
		.then(post => {
			if (post.length === 0) {
				return res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			}

			db
				.insertComment(comment)
				.then(comment => {
					res.status(201).json(comment);
				})
				.catch(e => {
					res.status(500).json({ error: 'There was an error while saving the comment to the database' });
				});
		})
		.catch(error => {
			return res.status(500).json({ error: 'The post information could not be retrieved.' });
		});
});

// updates a post - WORKING
router.put('/:id', (req, res) => {
	const { id } = req.params;
	console.log(id);
	const changes = req.body;
	console.log(changes);
	db.findById(id).then(post => {
		if (post.length === 0) {
			res.status(404).json({ error: 'The post with the specified ID does not exist.' });
		}
	});
	if (!req.body.title || !req.body.contents) {
		return res.status(400).json({ errorMessage: 'Please provide title and contents for the post' });
	}
	db
		.update(id, changes)
		.then(updatedPost => {
			res.status(200).json(updatedPost);
		})
		.catch(e => {
			res.status(500).json({ error: 'The post information could not be modified.' });
		});
});

//deletes post by id - WORKING
router.delete('/:id', (req, res) => {
	const { id } = req.params;
	db
		.remove(id)
		.then(result => {
			if (result) {
				res.status(200).json(result);
			}
			else {
				res.status(404).json({ message: 'The post with the specified ID does not exist.' });
			}
		})
		.catch(e => {
			res.status(500).json({ error: 'The post could not be removed' });
		});
});

module.exports = router;
