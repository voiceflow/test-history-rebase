export enum DiagramUpdateAction {
  USERS_UPDATE = 'USERS_UPDATE',
}

export enum SocketEvent {
  INITIALIZE = 'init',
  FAIL = 'fail',
  ERROR = 'error',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',
  CONNECT_FAILED = 'connect_failed',
  RECONNECT = 'reconnect',
}

export enum ServerEvent {
  SESSION_BUSY = 'session:busy',
  PROJECT_UPDATED = 'project:updated',
  INITIALIZE_DIAGRAM = 'diagram:init',
  UPDATE_DIAGRAM = 'diagram:update',
  VOLATILE_UPDATE_DIAGRAM = 'diagram:volatile',
  DIAGRAM_UPDATED = 'diagram:updated',
  DIAGRAM_LEFT = 'diagram:left',
  DIAGRAM_RECOVER = 'diagram:recover',
  DIAGRAM_REFRESH = 'diagram:refresh',
  SESSION_TERMINATED = 'session:takeover',
  SESSION_ACQUIRED = 'session:taken',
  FORCE_REFRESH = 'force_refresh',
  WORKSPACE_MEMBERSHIP_REVOKED = 'session:cancelled',
  WORKSPACE_PLAN_DENIED = 'workspace:plan:denied',
  WORKSPACE_MEMBERS_UPDATE = 'workspace:members:update',
  INITIALIZE_PROJECT = 'project:init',
}

export enum ClientEvent {
  CONNECT_DIAGRAM = 'diagramConnect',
  UPDATE_PROJECT = 'projectUpdate',
  UPDATE_DIAGRAM = 'diagramUpdate',
  VOLATILE_UPDATE_DIAGRAM = 'diagramVolatile',
  LEAVE_DIAGRAM = 'diagramLeave',
  DIAGRAM_HEARTBEAT = 'diagramHeartbeat',
  TAKEOVER_SESSION = 'sessionTakeover',
  CONNECT_PROJECT = 'projectConnect',
}

export type AnySocketEvent = SocketEvent | ServerEvent | ClientEvent;

export const CALL_MAP = {
  [ClientEvent.UPDATE_DIAGRAM]: ServerEvent.DIAGRAM_UPDATED,
  [ClientEvent.CONNECT_PROJECT]: ServerEvent.INITIALIZE_PROJECT,
  [ClientEvent.UPDATE_PROJECT]: ServerEvent.PROJECT_UPDATED,
  [ClientEvent.LEAVE_DIAGRAM]: ServerEvent.DIAGRAM_LEFT,
  [SocketEvent.INITIALIZE]: SocketEvent.INITIALIZE,
};
