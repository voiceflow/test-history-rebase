import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import React from 'react';

import { Alexa, General, Universal } from './components/ContentDescriptors';

export enum SettingSections {
  BASIC = 'Name & Language',
  CANVAS = 'Canvas Interactions',
  CHANNEL_SPECIFIC_FEATURES = 'Channel Specific Features',
  DANGER_ZONE = 'Danger Zone',
  DIALOGFLOW_CONSOLE = 'Dialogflow Console',
  GLOBAL_LOGIC = 'Global Logic',
  AI_ASSISTANT = 'AI Assistant',
}

export const DEFAULT_MAX_WIDTH = 700;

export interface PlatformSettingsMetaProps {
  name: string;
  sections: SettingSections[];
  descriptors: {
    localesDescriptor?: React.ReactNode;
    continuePrevious?: React.ReactNode;
    allowRepeat?: React.ReactNode;
    gadgets?: React.ReactNode;
    events?: React.ReactNode;
    repeatDialog?: any;
    repeatEverything?: any;
    modelSensitivity?: React.ReactNode;
    defaultVoice?: React.ReactNode;
    triggerPhraseDescriptor?: React.ReactNode;
    agentName?: React.ReactNode;
  };
  localeText?: string;
}

export const getSettingsMetaProps = Utils.platform.createPlatformAndProjectTypeSelector<PlatformSettingsMetaProps>(
  {
    [Platform.Constants.PlatformType.ALEXA]: {
      name: 'Alexa',
      sections: [
        SettingSections.BASIC,
        SettingSections.GLOBAL_LOGIC,
        SettingSections.CANVAS,
        SettingSections.CHANNEL_SPECIFIC_FEATURES,
        SettingSections.AI_ASSISTANT,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        events: <Alexa.Events />,
        gadgets: <Alexa.Gadgets />,
        allowRepeat: <Universal.AllowRepeat />,
        repeatDialog: General.RepeatDialog,
        defaultVoice: <Universal.DefaultVoice />,
        repeatEverything: General.RepeatEverything,
        continuePrevious: <Universal.ContinuePrevious />,
        modelSensitivity: <Alexa.ModelSensitivity />,
      },
      localeText: 'Locales',
    },
    [Platform.Constants.PlatformType.GOOGLE]: {
      name: 'Google',
      sections: [
        SettingSections.BASIC,
        SettingSections.GLOBAL_LOGIC,
        SettingSections.CANVAS,
        SettingSections.AI_ASSISTANT,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        allowRepeat: <Universal.AllowRepeat />,
        repeatDialog: General.RepeatDialog,
        repeatEverything: General.RepeatEverything,
        continuePrevious: <Universal.ContinuePrevious />,
        defaultVoice: <Universal.DefaultVoice />,
      },
      localeText: 'Language',
    },
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: {
      name: 'Dialogflow',
      sections: [
        SettingSections.BASIC,
        SettingSections.GLOBAL_LOGIC,
        SettingSections.DIALOGFLOW_CONSOLE,
        SettingSections.CANVAS,
        SettingSections.AI_ASSISTANT,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        repeatEverything: General.RepeatEverything,
      },
      localeText: 'Language',
    },
    [Platform.Constants.ProjectType.CHAT]: {
      name: 'Chatbot',
      sections: [
        SettingSections.BASIC,
        SettingSections.GLOBAL_LOGIC,
        SettingSections.CANVAS,
        SettingSections.AI_ASSISTANT,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {},
    },
  },
  {
    name: 'General',
    sections: [
      SettingSections.BASIC,
      SettingSections.GLOBAL_LOGIC,
      SettingSections.CANVAS,
      SettingSections.AI_ASSISTANT,
      SettingSections.DANGER_ZONE,
    ],
    descriptors: {
      defaultVoice: <Universal.DefaultVoice />,
    },
  }
);
