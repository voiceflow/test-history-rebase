import client from './client';
import diagram from './diagram';
import global from './global';
import project from './project';

const socketClient = {
  global,
  project,
  diagram,

  connect: client.connect,
  auth: client.auth,
  disconnect: client.disconnect,
};

export default socketClient;

export type SocketClient = typeof socketClient;
