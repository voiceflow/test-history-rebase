import analytics from './analytics';
import clipboard from './clipboard';
import diagram from './diagram';
import display from './display';
import project from './project';
import session from './session';
import skill from './skill';
import team from './team';
import testing from './testing';
import user from './user';
import product from './product';

const client = {
  session,
  analytics,
  diagram,
  user,
  team,
  project,
  testing,
  clipboard,
  skill,
  display,
  socket: null,
  product,
};

export default client;
