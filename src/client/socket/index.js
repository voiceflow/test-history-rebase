import SocketClient, { SocketStatus } from './client';
import createRealtimeClient from './realtime';

function createSocketClient(dispatch) {
  const client = new SocketClient(dispatch);

  return {
    realtime: createRealtimeClient(client),

    connect: client.connect,
    auth: client.auth,
    disconnect: client.disconnect,

    get isHealthy() {
      return client.socket.status !== SocketStatus.FAIL;
    },

    lockProject(skillID, handleJoined, handleOccupied) {
      client.socket.on('occupied', handleOccupied);
      client.socket.on('joined', (data) => data === skillID && handleJoined());

      client.connectionHandlers[`SKILL_${skillID}`] = () => client.socket.emit('project', { skill_id: skillID, reconnect: true });

      client.socket.emit('project', { skill_id: skillID });
    },

    takeoverProject(skillID) {
      client.socket.emit('takeover', { skill_id: skillID });
    },

    releaseProject(skillID) {
      delete client.connectionHandlers[`SKILL_${skillID}`];
      client.socket.emit('leave');
    },
  };
}

export default createSocketClient;
