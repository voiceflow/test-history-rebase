import * as Voiceflow from '@/configs/voiceflow';

import * as Project from './project';

export const CONFIG = Voiceflow.Chat.extend({
  name: 'Microsoft Teams',

  icon: {
    name: 'logoMicrosoftTeams',
    color: '#5059C9',
  },

  logo: 'logoMicrosoftTeams',

  project: Project.CONFIG,

  description: 'Design, prototype and launch your assistant on Microsoft Teams.',
})(Voiceflow.Chat.validate);

export type Config = typeof CONFIG;
