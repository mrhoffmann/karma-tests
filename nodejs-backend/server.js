const app = require('express')();
const prefix = 'SOCKET-SERVER:';

app.get('/', (req, res) => {
	res.status(401).json({ msg: 'Nope.' });
});

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
	cors: { origin: '*' },
});
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
	console.log(`${prefix} a user connected`);

	socket.on('message', (message) => {
		console.log(`${prefix}MESSAGE: ${message}`);
		io.emit('message', `${message}`);
	});

	socket.on('disconnect', () => {
		console.log(`${prefix} a user disconnected!`);
	});
});

httpServer.listen(port, () =>
	console.log(`${prefix} listening on port ${port}`)
);
