import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import React from 'react';

import { Alexa, Dialogflow, General, Google, Universal } from './components/ContentDescriptors';

export enum SettingSections {
  BASIC = 'Name & Language',
  CANVAS = 'Canvas',
  GLOBAL_CONVERSATION_LOGIC = 'Global Conversation Logic',
  CHANNEL_SPECIFIC_FEATURES = 'Channel Specific Features',
  DANGER_ZONE = 'Danger Zone',
  DIALOGFLOW_CONSOLE = 'Dialogflow Console',
  TEST_TOOL = 'Chat Interface',
  GLOBAL_LOGIC = 'Global Logic',
}

export const DEFAULT_MAX_WIDTH = 700;

export interface PlatformSettingsMetaProps {
  name: string;
  sections: SettingSections[];
  descriptors: {
    projectName: React.ReactNode;
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
        SettingSections.GLOBAL_CONVERSATION_LOGIC,
        SettingSections.TEST_TOOL,
        SettingSections.CHANNEL_SPECIFIC_FEATURES,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        events: <Alexa.Events />,
        gadgets: <Alexa.Gadgets />,
        allowRepeat: <Universal.AllowRepeat />,
        projectName: <Alexa.ProjectName />,
        repeatDialog: General.RepeatDialog,
        defaultVoice: <Universal.DefaultVoice />,
        repeatEverything: General.RepeatEverything,
        continuePrevious: <Universal.ContinuePrevious />,
        modelSensitivity: <Alexa.ModelSensitivity />,
        localesDescriptor: <Alexa.Locales />,
      },
      localeText: 'Locales',
    },
    [Platform.Constants.PlatformType.GOOGLE]: {
      name: 'Google',
      sections: [
        SettingSections.BASIC,
        SettingSections.GLOBAL_LOGIC,
        SettingSections.CANVAS,
        SettingSections.GLOBAL_CONVERSATION_LOGIC,
        SettingSections.TEST_TOOL,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        projectName: <Google.ProjectName />,
        allowRepeat: <Universal.AllowRepeat />,
        repeatDialog: General.RepeatDialog,
        repeatEverything: General.RepeatEverything,
        continuePrevious: <Universal.ContinuePrevious />,
        localesDescriptor: <Google.Locales />,
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
        SettingSections.TEST_TOOL,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        projectName: <General.ProjectName />,
        repeatEverything: General.RepeatEverything,
        localesDescriptor: <Dialogflow.Locales />,
      },
      localeText: 'Language',
    },
    [Platform.Constants.ProjectType.CHAT]: {
      name: 'Chatbot',
      sections: [SettingSections.BASIC, SettingSections.GLOBAL_LOGIC, SettingSections.CANVAS, SettingSections.TEST_TOOL, SettingSections.DANGER_ZONE],
      descriptors: {
        projectName: <General.ProjectName />,
      },
    },
  },
  {
    name: 'General',
    sections: [
      SettingSections.BASIC,
      SettingSections.GLOBAL_LOGIC,
      SettingSections.CANVAS,
      SettingSections.GLOBAL_CONVERSATION_LOGIC,
      SettingSections.TEST_TOOL,
      SettingSections.DANGER_ZONE,
    ],
    descriptors: {
      projectName: <General.ProjectName />,
    },
  }
);
