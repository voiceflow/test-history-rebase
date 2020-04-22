import analytics from './analytics';
import clipboard from './clipboard';
import diagram from './diagram';
import display from './display';
import feature from './feature';
import file from './file';
import list from './lists';
import onboarding from './onboarding';
import product from './product';
import project from './project';
import session from './session';
import skill from './skill';
import createSocketClient from './socket';
import template from './template';
import testing from './testing';
import testingV2 from './testingV2';
import user from './user';
import workspace from './workspace';

export * from './onboarding';

const client = {
  session,
  analytics,
  diagram,
  user,
  workspace,
  list,
  project,
  testing,
  testingV2,
  clipboard,
  skill,
  display,
  product,
  file,
  template,
  onboarding,
  feature,
  socket: null as ReturnType<typeof createSocketClient> | null,
};

export default client;
