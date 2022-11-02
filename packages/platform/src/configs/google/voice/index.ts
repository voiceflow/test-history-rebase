import * as Common from '@platform/configs/common';

export const CONFIG = Common.Voice.Type.extend({
  name: 'Google Assistant',

  icon: {
    name: 'googleAssistant',
    color: '#4285F4',
  },

  description: 'Design, prototype and launch Google Actions with our one-click integration.',
});

export type Config = typeof CONFIG;
