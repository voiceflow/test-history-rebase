import * as Common from '@/configs/common';

import * as Adapters from './adapters';
import * as Models from './models';
import * as Project from './project';
import * as Utils from './utils';

export { Adapters, Models, Project, Utils };

export const CONFIG = Common.Voice.extend({
  name: 'Google Assistant',

  icon: { name: 'googleAssistant', color: '#4285F4' },

  utils: Utils.CONFIG,

  logo: 'logoGoogleAssistant',

  project: Project.CONFIG,

  adapters: Adapters.CONFIG,

  description: 'Design, prototype and launch Google Actions with our one-click integration.',
})(Common.Voice.validate);

export type Config = typeof CONFIG;
