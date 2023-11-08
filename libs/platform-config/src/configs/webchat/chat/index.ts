import * as Voiceflow from '@platform-config/configs/voiceflow';

import * as Project from './project';

export const CONFIG = Voiceflow.Chat.extend({
  name: 'Web Chat',

  icon: {
    name: 'chatWidget',
    color: '#132144',
  },

  project: Project.CONFIG,

  description: 'Deploy a Web Chat widget to your website in minutes.',
})(Voiceflow.Chat.validate);

export type Config = typeof CONFIG;
