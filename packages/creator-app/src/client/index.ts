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
import reportTags from './reportTags';
import session from './session';
import socket from './socket';
import sso from './sso';
import template from './template';
import thread from './thread';
import transcript from './transcript';
import user from './user';
import workspace from './workspace';

type Platform = typeof getPlatformClient & typeof platformClients;

const client = {
  api,

  platform: Object.assign(getPlatformClient, platformClients) as Platform,

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
  transcript,
  reportTags,
};

export default client;
