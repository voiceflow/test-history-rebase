import * as Common from '@platform-config/configs/common';

import * as Adapters from './adapters';
import * as Models from './models';
import * as Project from './project';

export { Adapters, Models, Project };

export const CONFIG = Common.Voice.extend({
  name: 'Google Assistant',

  icon: {
    name: 'googleAssistant',
    color: '#4285F4',
  },

  logo: 'googleAssistantLogo',

  project: Project.CONFIG,

  adapters: Adapters.CONFIG,

  description: 'Design, prototype and launch Google Actions with our one-click integration.',
});

export type Config = typeof CONFIG;
