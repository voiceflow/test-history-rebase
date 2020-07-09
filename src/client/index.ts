import analytics from './analytics';
import canvasExport from './canvasExport';
import clipboard from './clipboard';
import comment from './comment';
import diagram from './diagram';
import display from './display';
import feature from './feature';
import file from './file';
import list from './lists';
import onboarding from './onboarding';
import product from './product';
import project from './project';
import prototype from './prototype';
import session from './session';
import skill from './skill';
import socket from './socket';
import template from './template';
import thread from './thread';
import user from './user';
import workspace from './workspace';
import zapier from './zapier';

export * from './onboarding';

const client = {
  session,
  analytics,
  diagram,
  user,
  workspace,
  list,
  project,
  comment,
  thread,
  prototype,
  clipboard,
  skill,
  display,
  product,
  file,
  template,
  onboarding,
  feature,
  zapier,
  socket,
  canvasExport,
};

export default client;
