import * as Common from '@platform/configs/common';

export const CONFIG = Common.Chat.Type.extend({
  name: 'Web Chat',

  icon: {
    name: 'chatWidget',
    color: '#132144',
  },

  description: 'Deploy a webchat widget to your website in minutes.',
});

export type Config = typeof CONFIG;
