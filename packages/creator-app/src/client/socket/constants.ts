export enum DiagramUpdateAction {
  USERS_UPDATE = 'USERS_UPDATE',
}

export enum SocketEvent {
  LOGOUT = 'logout',
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
  INITIALIZE_PROJECT = 'project:init',
  PROJECT_UPDATED = 'project:updated',

  INITIALIZE_DIAGRAM = 'diagram:init',
  UPDATE_DIAGRAM = 'diagram:update',
  VOLATILE_UPDATE_DIAGRAM = 'diagram:volatile',
  DIAGRAM_UPDATED = 'diagram:updated',
  DIAGRAM_LEFT = 'diagram:left',
  DIAGRAM_RECOVER = 'diagram:recover',
  DIAGRAM_REFRESH = 'diagram:refresh',
  FORCE_REFRESH = 'force_refresh',

  SESSION_BUSY = 'session:busy',
  SESSION_TERMINATED = 'session:takeover',
  SESSION_ACQUIRED = 'session:taken',

  WORKSPACE_MEMBERSHIP_REVOKED = 'session:cancelled',
  WORKSPACE_PLAN_DENIED = 'workspace:plan:denied',
  WORKSPACE_MEMBERS_UPDATE = 'workspace:members:update',

  NEW_THREAD = 'thread:created',
  THREAD_UPDATED = 'thread:updated',
  THREAD_DELETED = 'thread:deleted',
  NEW_REPLY = 'comment:created',
  COMMENT_UPDATED = 'comment:updated',
  COMMENT_DELETED = 'comment:deleted',

  TRANSCRIPT_DELETED = 'transcript:deleted',
  PROTOTYPE_WEBHOOK = 'prototype:webhook',
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
  [SocketEvent.LOGOUT]: SocketEvent.LOGOUT,
};
