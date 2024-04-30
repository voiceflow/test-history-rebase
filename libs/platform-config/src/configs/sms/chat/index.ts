import * as Voiceflow from '@/configs/voiceflow';

import * as Project from './project';

export const CONFIG = Voiceflow.Chat.extend({
  name: 'Twilio SMS',

  icon: {
    name: 'twilio',
    color: '#CF272D',
  },

  project: Project.CONFIG,

  description: 'Deploy an SMS agent in minutes.',
})(Voiceflow.Chat.validate);

export type Config = typeof CONFIG;
