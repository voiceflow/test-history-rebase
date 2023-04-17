import * as Common from '@platform-config/configs/common';

import * as Adapters from './adapters';
import * as Models from './models';
import * as Project from './project';
import * as Utils from './utils';

export { Adapters, Models, Project, Utils };

export const CONFIG = Common.Voice.extend({
  name: 'Amazon Alexa',

  icon: { name: 'amazonAlexa', color: '#5fcaf4' },

  utils: Utils.CONFIG,

  project: Project.CONFIG,

  adapters: Adapters.CONFIG,

  description: 'Design, prototype and launch Alexa Skills with our one-click integration.',
})(Common.Voice.validate);

export type Config = typeof CONFIG;
