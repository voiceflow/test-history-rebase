import * as Voiceflow from '@platform-config/configs/voiceflow';

import * as Project from './project';

export const CONFIG = Voiceflow.Chat.extend({
  name: 'WhatsApp',

  icon: {
    name: 'whatsApp',
    color: '#23b33a',
  },

  logo: 'logoWhatsapp',

  project: Project.CONFIG,

  description: 'Deploy a Whatsapp agent in minutes.',
})(Voiceflow.Chat.validate);

export type Config = typeof CONFIG;
