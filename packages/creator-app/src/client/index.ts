import api from './api';
import backup from './backup';
import canvasExport from './canvasExport';
import comment from './comment';
import feature from './feature';
import file from './file';
import integrations from './integrations';
import organization from './organization';
import platformClients, { getPlatformClient } from './platforms';
import projectList from './projectList';
import prototype from './prototype';
import realtime from './realtime';
import reportTags from './reportTags';
import saml from './saml';
import session from './session';
import socket from './socket';
import sso from './sso';
import template from './template';
import thread from './thread';
import transcript from './transcript';
import user from './user';
import version from './version';
import workspace from './workspace';

type Platform = typeof getPlatformClient & typeof platformClients;

const client = {
  api,

  platform: Object.assign(getPlatformClient, platformClients) as Platform,

  backup,
  canvasExport,
  comment,
  feature,
  file,
  integrations,
  organization,
  projectList,
  prototype,
  session,
  socket,
  sso,
  saml,
  template,
  thread,
  user,
  workspace,
  transcript,
  version,
  reportTags,
  realtime,
};

export default client;
