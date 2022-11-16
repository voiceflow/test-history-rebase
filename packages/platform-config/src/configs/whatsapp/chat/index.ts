import * as Voiceflow from '@platform-config/configs/voiceflow';

import * as Project from './project';

export const CONFIG = Voiceflow.Chat.extend({
  name: 'Whatsapp',

  icon: {
    name: 'logoWhatsapp',
    color: '#23b33a',
  },

  logo: 'logoWhatsapp',

  project: Project.CONFIG,

  description: 'Deploy a Whatsapp agent in minutes.',
});

export type Config = typeof CONFIG;
