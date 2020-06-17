import SocketClient from './client';
import { ClientEvent, ServerEvent } from './constants';

function createProjectSocketClient(client: SocketClient) {
  return {
    initialize(projectID: string) {
      return new Promise((resolve) => {
        // once this is received, we have the ability to send notifications for comments
        client.once(ServerEvent.INITIALIZE_PROJECT, resolve);

        // expect a `project:init` event to be sent in return
        client.emit(ClientEvent.CONNECT_PROJECT, {
          projectId: projectID,
        });
      });
    },
  };
}

export default createProjectSocketClient;
