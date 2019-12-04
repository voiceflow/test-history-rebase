import analytics from './analytics';
import clipboard from './clipboard';
import diagram from './diagram';
import display from './display';
import list from './lists';
import product from './product';
import project from './project';
import session from './session';
import skill from './skill';
import testing from './testing';
import user from './user';
import workspace from './workspace';

const client = {
  session,
  analytics,
  diagram,
  user,
  workspace,
  list,
  project,
  testing,
  clipboard,
  skill,
  display,
  socket: null,
  product,
};

export default client;
