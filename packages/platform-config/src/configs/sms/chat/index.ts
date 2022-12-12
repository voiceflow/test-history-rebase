import * as Voiceflow from '@platform-config/configs/voiceflow';

import * as Project from './project';

export const CONFIG = Voiceflow.Chat.extend({
  name: 'SMS',

  icon: {
    name: 'systemMessage', // change icon
    color: '#6E849AD9',
  },

  project: Project.CONFIG,

  description: 'Deploy an SMS agent in minutes.',
})(Voiceflow.Chat.validate);

export type Config = typeof CONFIG;
