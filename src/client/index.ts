import API from '@voiceflow/api-sdk';

import { API_ENDPOINT } from '@/config';
import { PlatformType } from '@/constants';

import analytics from './analytics';
import backup from './backup';
import canvasExport from './canvasExport';
import comment from './comment';
import feature from './feature';
import file from './file';
import integrations from './integrations';
import platformClients, { platformServicesMap } from './platforms';
import projectList from './projectList';
import prototype from './prototype';
import session from './session';
import socket from './socket';
import sso from './sso';
import template from './template';
import thread from './thread';
import user from './user';
import workspace from './workspace';

const api = new API({
  clientKey: 'CREATOR_APP',
  apiEndpoint: `${API_ENDPOINT}/v2`,
});

const client = {
  api: api.generatePublicClient(),

  platform: Object.assign(<T extends PlatformType>(platform: T) => platformServicesMap[platform], platformClients),

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
