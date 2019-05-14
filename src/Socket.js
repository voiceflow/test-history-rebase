import socket from 'socket.io-client';

const getEndpoint = () => {
	let port = '';
	let protocol = 'https';
	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		port = ':8080';
		protocol = 'http';
	}
	return `${protocol}://${window.location.hostname}${port}`;
};

const socketFail = () => {
	window.CreatorSocket.status = 'FAIL';
};

window.CreatorSocket = socket(getEndpoint());
window.CreatorSocket.connectedCB = {};
// catch error events
window.CreatorSocket.on('fail', socketFail);
window.CreatorSocket.on('error', socketFail);
// to catch if the server is offline
window.CreatorSocket.on('connect_error', socketFail);
// catch failed connection attempts
window.CreatorSocket.on('connect_failed', socketFail);
// to catch connection events
window.CreatorSocket.on('connect', () => {
	window.CreatorSocket.status = 'CONNECTED';
	// queued up events after reconnection
	for (var cb in window.CreatorSocket.connectedCB) {
		if (typeof window.CreatorSocket.connectedCB[cb] === 'function') {
			window.CreatorSocket.connectedCB[cb]();
		}
	}
});

window.addEventListener('beforeunload', function () {
	if (window.CreatorSocket && window.CreatorSocket.disconnect) {
		window.CreatorSocket.disconnect();
	}
});

console.log("Socket ran");
