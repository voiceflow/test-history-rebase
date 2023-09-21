import { getPlatformClient, platformClients } from '@/platforms/selectors';

import analytics from './analytics';
import api, { apiV3 } from './api';
import auth from './auth';
import backup from './backup';
import canvasExport from './canvasExport';
import feature from './feature';
import file from './file';
import gptGen from './gptGen';
import identity from './identity';
import maintenance from './maintenance';
import mlGateway from './mlGateway';
import nluManager from './nluManager';
import project from './project';
import prototype, { testAPIClient } from './prototype';
import realtime, { realtimeIO } from './realtime';
import reportTags from './reportTags';
import template from './template';
import transcript from './transcript';
import upload from './upload';
import usageAnalytics from './usageAnalytics';
import version from './version';
import workspace from './workspace';

type Platform = typeof getPlatformClient & typeof platformClients;

const client = {
  api,
  apiV3,
  auth,
  identity,
  analytics,
  usageAnalytics,

  platform: Object.assign(getPlatformClient, platformClients) as Platform,

  backup,
  canvasExport,
  feature,
  file,
  project,
  prototype,
  testAPIClient,
  template,
  workspace,
  transcript,
  version,
  reportTags,
  realtime,
  realtimeIO,
  maintenance,
  upload,
  mlGateway,
  nluManager,
  gptGen,
};

export type Client = typeof client;

export default client;
