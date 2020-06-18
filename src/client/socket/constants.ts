export enum SocketEvent {
  INITIALIZE = 'init',
  FAIL = 'fail',
  ERROR = 'error',
  CONNECT = 'connect',
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
  SESSION_CANCELLED = 'session:cancelled',
  SESSION_TAKEOVER = 'session:takeover',
  SESSION_TAKEN = 'session:taken',
  FORCE_REFRESH = 'force_refresh',
  WORKSPACE_PLAN_DENIED = 'workspace:plan:denied',
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
