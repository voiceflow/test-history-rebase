import * as Common from '@platform/configs/common';

import * as Adapters from '../adapters';

export const CONFIG = Common.Voice.Type.extend({
  name: 'Amazon Alexa',

  icon: { name: 'amazonAlexa', color: '#5fcaf4' },

  adapters: Adapters.CONFIG,

  description: 'Design, prototype and launch Alexa Skills with our one-click integration.',
});

export type Config = typeof CONFIG;
