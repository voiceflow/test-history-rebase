import * as Voiceflow from '@platform-config/configs/voiceflow';

export const CONFIG = Voiceflow.Chat.extend({
  name: 'Web Chat',

  icon: {
    name: 'chatWidget',
    color: '#132144',
  },

  description: 'Deploy a webchat widget to your website in minutes.',
});

export type Config = typeof CONFIG;
