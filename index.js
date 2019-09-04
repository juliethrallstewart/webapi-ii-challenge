// const server = require('./server.js');
const express = require('express');
const server = express();

const port = 8000;
server.use(express.json());
server.get('/', (req, res) => res.send('\nAPI running\n'));
server.listen(port, () => console.log(`\n API on Port ${port}\n`));

const postsRoutes = require('./routes/postsRoutes');
server.use('/api/posts', postsRoutes);
