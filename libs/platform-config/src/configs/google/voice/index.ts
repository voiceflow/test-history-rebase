import * as Base from '@platform-config/configs/base';
import * as Common from '@platform-config/configs/common';

export const CONFIG = Common.Voice.extend({
  name: 'Google Assistant',

  icon: { name: 'googleAssistant', color: '#4285F4' },

  logo: 'logoGoogleAssistant',

  project: {
    ...Base.Project.CONFIG,

    name: 'Google Action',
  },

  description: 'Design, prototype and launch Google Actions with our one-click integration.',
})(Common.Voice.validate);

export type Config = typeof CONFIG;
