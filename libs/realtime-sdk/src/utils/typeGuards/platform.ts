import * as Platform from '@voiceflow/platform-config/backend';

import { legacyPlatformToProjectType, PLATFORMS_WITH_EDITABLE_NO_REPLY_DELAY } from '@/constants';

import { createTypeGuardCreator } from './utils';

const createPlatformTypeGuard = createTypeGuardCreator<Platform.Constants.PlatformType>();
const createProjectTypeTypeGuard = createTypeGuardCreator<Platform.Constants.ProjectType>();

export const isAlexaPlatform = createPlatformTypeGuard<Platform.Constants.PlatformType>(
  Platform.Constants.PlatformType.ALEXA
);
export const isGooglePlatform = createPlatformTypeGuard<Platform.Constants.PlatformType>(
  Platform.Constants.PlatformType.GOOGLE
);
export const isWebChatPlatform = createPlatformTypeGuard<Platform.Constants.PlatformType>(
  Platform.Constants.PlatformType.WEBCHAT
);
export const isWhatsAppPlatform = createPlatformTypeGuard<Platform.Constants.PlatformType>(
  Platform.Constants.PlatformType.WHATSAPP
);
export const isSMSPlatform = createPlatformTypeGuard<Platform.Constants.PlatformType>(
  Platform.Constants.PlatformType.SMS
);
export const isMicrosoftTeamsPlatform = createPlatformTypeGuard<Platform.Constants.PlatformType>(
  Platform.Constants.PlatformType.MICROSOFT_TEAMS
);

export const isDialogflowPlatform = (
  platform?: Platform.Constants.PlatformType | null
): platform is typeof Platform.Constants.PlatformType.DIALOGFLOW_ES =>
  !!platform && legacyPlatformToProjectType(platform)?.platform === Platform.Constants.PlatformType.DIALOGFLOW_ES;

export const isDialogflowCXPlatform = (
  platform?: Platform.Constants.PlatformType | null
): platform is typeof Platform.Constants.PlatformType.DIALOGFLOW_CX =>
  !!platform && legacyPlatformToProjectType(platform)?.platform === Platform.Constants.PlatformType.DIALOGFLOW_CX;

export const isVoiceflowNluModel = (
  nlu?: Platform.Constants.NLUType | null
): nlu is typeof Platform.Constants.NLUType.VOICEFLOW => !!nlu && nlu === Platform.Constants.NLUType.VOICEFLOW;

export const isChatProjectType = createProjectTypeTypeGuard(Platform.Constants.ProjectType.CHAT);
export const isVoiceProjectType = createProjectTypeTypeGuard(Platform.Constants.ProjectType.VOICE);

export const isPlatformWithEditableNoReplyDelay = createPlatformTypeGuard(PLATFORMS_WITH_EDITABLE_NO_REPLY_DELAY);
