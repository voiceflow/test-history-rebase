import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { createPlatformSelector } from '@/utils/platform';

import { Alexa, Dialogflow, General, Google, Universal } from './components/ContentDescriptors';

export enum SettingSections {
  BASIC = 'Basic',
  CANVAS = 'Canvas',
  GLOBAL_CONVERSATION_LOGIC = 'Global Conversation Logic',
  CHANNEL_SPECIFIC_FEATURES = 'Channel Specific Features',
  DANGER_ZONE = 'Danger Zone',
  DIALOGFLOW_CONSOLE = 'Dialogflow Console',
  TEST_TOOL = 'Chat Interface',
}

export const DEFAULT_MAX_WIDTH = 700;

export interface PlatformSettingsMetaProps {
  name: string;
  sections: SettingSections[];
  descriptors: {
    projectName: React.FC | string;
    invocationName?: React.FC | string;
    invocationNameShort?: React.FC | string;
    localesDescriptor?: React.FC | string;
    continuePrevious?: React.FC | string;
    allowRepeat?: React.FC | string;
    gadgets?: React.FC | string;
    events?: React.FC | string;
    repeatDialog?: any;
    repeatEverything?: any;
    modelSensitivity?: React.FC | string;
    defaultVoice?: React.FC | string;
    triggerPhraseDescriptor?: React.FC | string;
    agentName?: React.FC | string;
  };
  localeText?: string;
}

export const getSettingsMetaProps = createPlatformSelector<PlatformSettingsMetaProps>(
  {
    [Constants.PlatformType.ALEXA]: {
      name: 'Alexa',
      sections: [
        SettingSections.BASIC,
        SettingSections.CANVAS,
        SettingSections.GLOBAL_CONVERSATION_LOGIC,
        SettingSections.TEST_TOOL,
        SettingSections.CHANNEL_SPECIFIC_FEATURES,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        projectName: Alexa.ProjectName,
        invocationName: Alexa.InvocationName,
        invocationNameShort: Alexa.InvocationNameShort,
        localesDescriptor: Alexa.Locales,
        continuePrevious: Universal.ContinuePrevious,
        allowRepeat: Universal.AllowRepeat,
        gadgets: Alexa.Gadgets,
        events: Alexa.Events,
        repeatDialog: General.RepeatDialog,
        repeatEverything: General.RepeatEverything,
        modelSensitivity: Alexa.ModelSensitivity,
        defaultVoice: Universal.DefaultVoice,
      },
      localeText: 'Locales',
    },
    [Constants.PlatformType.GOOGLE]: {
      name: 'Google',
      sections: [
        SettingSections.BASIC,
        SettingSections.CANVAS,
        SettingSections.GLOBAL_CONVERSATION_LOGIC,
        SettingSections.TEST_TOOL,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        projectName: Google.ProjectName,
        invocationName: Google.InvocationName,
        invocationNameShort: Alexa.InvocationNameShort,
        localesDescriptor: Google.Locales,
        continuePrevious: Universal.ContinuePrevious,
        allowRepeat: Universal.AllowRepeat,
        repeatDialog: General.RepeatDialog,
        repeatEverything: General.RepeatEverything,
      },
      localeText: 'Language',
    },
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: {
      name: 'Dialogflow Chat',
      sections: [
        SettingSections.BASIC,
        SettingSections.DIALOGFLOW_CONSOLE,
        SettingSections.CANVAS,
        SettingSections.TEST_TOOL,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        projectName: General.ProjectName,
        agentName: Dialogflow.AgentName,
        localesDescriptor: Dialogflow.Locales,
        triggerPhraseDescriptor: Dialogflow.TriggerPhrase,
        repeatEverything: General.RepeatEverything,
      },
      localeText: 'Language',
    },
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: {
      name: 'Dialogflow Voice',
      sections: [
        SettingSections.BASIC,
        SettingSections.DIALOGFLOW_CONSOLE,
        SettingSections.CANVAS,
        SettingSections.TEST_TOOL,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        projectName: General.ProjectName,
        agentName: Dialogflow.AgentName,
        localesDescriptor: Dialogflow.Locales,
        triggerPhraseDescriptor: Dialogflow.TriggerPhrase,
        repeatEverything: General.RepeatEverything,
      },
      localeText: 'Language',
    },
    [Constants.PlatformType.CHATBOT]: {
      name: 'Chatbot',
      sections: [SettingSections.BASIC, SettingSections.CANVAS, SettingSections.TEST_TOOL, SettingSections.DANGER_ZONE],
      descriptors: {
        projectName: General.ProjectName,
      },
    },
  },
  {
    name: 'General',
    sections: [
      SettingSections.BASIC,
      SettingSections.CANVAS,
      SettingSections.GLOBAL_CONVERSATION_LOGIC,
      SettingSections.TEST_TOOL,
      SettingSections.DANGER_ZONE,
    ],
    descriptors: {
      projectName: General.ProjectName,
    },
  }
);
