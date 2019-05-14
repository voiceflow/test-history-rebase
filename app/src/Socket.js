import { Component } from 'react';
import socket from 'socket.io-client';

class Socket extends Component {

	getEndpoint = () => {
		let port = '';
		let protocol = 'https';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			port = ':8080';
			protocol = 'http';
		}
		return `${protocol}://${window.location.hostname}${port}`;
	};

	socketFail = () => {
		window.CreatorSocket.status = 'FAIL';
	};

	componentDidMount() {
		window.CreatorSocket = socket(this.getEndpoint());
		window.CreatorSocket.connectedCB = {};
		// catch error events
		window.CreatorSocket.on('fail', this.socketFail);
		window.CreatorSocket.on('error', this.socketFail);
		// to catch if the server is offline
		window.CreatorSocket.on('connect_error', this.socketFail);
		// catch failed connection attempts
		window.CreatorSocket.on('connect_failed', this.socketFail);
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
	}

	render() {
		return null;
	}


}

export default Socket;




