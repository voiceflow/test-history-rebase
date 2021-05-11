import analytics from './analytics';
import api from './api';
import backup from './backup';
import canvasExport from './canvasExport';
import comment from './comment';
import feature from './feature';
import file from './file';
import integrations from './integrations';
import platformClients, { getPlatformClient } from './platforms';
import projectList from './projectList';
import prototype from './prototype';
import session from './session';
import socket from './socket';
import sso from './sso';
import template from './template';
import thread from './thread';
import user from './user';
import workspace from './workspace';

const client = {
  api,

  platform: Object.assign(getPlatformClient, platformClients),

  analytics,
  backup,
  canvasExport,
  comment,
  feature,
  file,
  integrations,
  projectList,
  prototype,
  session,
  socket,
  sso,
  template,
  thread,
  user,
  workspace,
};

export default client;
