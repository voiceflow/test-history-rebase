import analytics from './analytics';
import canvasExport from './canvasExport';
import clipboard from './clipboard';
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
import createSocketClient from './socket';
import template from './template';
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
  socket: null as ReturnType<typeof createSocketClient> | null,
  canvasExport,
};

export default client;
