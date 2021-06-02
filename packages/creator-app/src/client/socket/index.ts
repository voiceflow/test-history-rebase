import client from './client';
import diagram from './diagram';
import global from './global';
import project from './project';

const socketClient = {
  global,
  project,
  diagram,

  isConnected: () => client.isConnected,

  connect: client.connect,
  auth: client.auth,
  logout: client.logout,
  disconnect: client.disconnect,
};

export default socketClient;

export type SocketClient = typeof socketClient;
