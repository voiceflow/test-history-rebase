import * as Platform from '@voiceflow/platform-config';

import * as NLU from '@/config/nlu';

import { Upcoming } from '../../constants';
import { CardTypes } from './components';

export const PLATFORM_BUBBLES: CardTypes.Bubble[] = [
  {
    name: 'ChatGPT',
    icon: 'logoOpenAI',
  },
  {
    name: Platform.Webchat.CONFIG.types.chat.name,
    icon: Platform.Webchat.CONFIG.types.chat.icon.name,
    color: Platform.Webchat.CONFIG.types.chat.icon.color,
  },
  {
    name: Platform.Whatsapp.CONFIG.types.chat.name,
    icon: Platform.Whatsapp.CONFIG.types.chat.logo,
  },
  {
    name: Upcoming.Facebook.CONFIG.types.chat.name,
    icon: Upcoming.Facebook.CONFIG.types.chat.logo,
  },
  {
    name: Platform.MicrosoftTeams.CONFIG.types.chat.name,
    icon: Platform.MicrosoftTeams.CONFIG.types.chat.logo,
  },
  {
    name: Upcoming.Slack.CONFIG.types.chat.name,
    icon: Upcoming.Slack.CONFIG.types.chat.logo,
  },
  {
    name: Platform.SMS.CONFIG.name,
    icon: Platform.SMS.CONFIG.types.chat.icon.name,
    color: Platform.SMS.CONFIG.types.chat.icon.color,
  },
  {
    name: Platform.Alexa.CONFIG.name,
    icon: Platform.Alexa.CONFIG.types.voice.icon.name,
    color: Platform.Alexa.CONFIG.types.voice.icon.color,
  },
  {
    name: Upcoming.Telegram.CONFIG.types.chat.name,
    icon: Upcoming.Telegram.CONFIG.types.chat.logo,
  },
];

export const NLU_BUBBLES: CardTypes.Bubble[] = [
  {
    name: NLU.DialogflowCX.CONFIG.name,
    icon: NLU.DialogflowCX.CONFIG.icon.name,
    color: NLU.DialogflowCX.CONFIG.icon.color,
  },
  {
    name: NLU.DialogflowES.CONFIG.name,
    icon: NLU.DialogflowES.CONFIG.icon.name,
    color: NLU.DialogflowES.CONFIG.icon.color,
  },
  {
    name: NLU.Lex.CONFIG.name,
    icon: NLU.Lex.CONFIG.icon.name,
    color: NLU.Lex.CONFIG.icon.color,
  },
  {
    name: NLU.Luis.CONFIG.name,
    icon: NLU.Luis.CONFIG.icon.name,
    color: NLU.Luis.CONFIG.icon.color,
  },
  {
    name: NLU.Rasa.CONFIG.name,
    icon: NLU.Rasa.CONFIG.icon.name,
    color: NLU.Rasa.CONFIG.icon.color,
  },
  {
    name: NLU.Watson.CONFIG.name,
    icon: NLU.Watson.CONFIG.icon.name,
    color: NLU.Watson.CONFIG.icon.color,
  },
  {
    name: NLU.NuanceMix.CONFIG.name,
    icon: NLU.NuanceMix.CONFIG.icon.name,
    color: NLU.NuanceMix.CONFIG.icon.color,
  },
  {
    name: NLU.Einstein.CONFIG.name,
    icon: NLU.Einstein.CONFIG.icon.name,
    color: NLU.Einstein.CONFIG.icon.color,
  },
];
