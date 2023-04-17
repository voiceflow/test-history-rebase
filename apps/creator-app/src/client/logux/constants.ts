export enum ConnectionStatus {
  // client has not attempted connection
  IDLE = 'idle',
  // client has an active connection with the server
  CONNECTED = 'connected',
  // client is disconnected and waiting to re-connect
  RECONNECTING = 'reconnecting',
}

export enum ClientEvents {
  WRONG_CREDENTIALS = 'wrong_credentials',
}

export const CLIENT_EVENTS: string[] = [...Object.values(ConnectionStatus), ...Object.values(ClientEvents)];
