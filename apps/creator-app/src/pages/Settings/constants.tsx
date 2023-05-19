import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import React from 'react';

import * as ContentDescriptors from './components/ContentDescriptors';

export enum SettingSections {
  BASIC = 'Name & Language',
  CANVAS = 'Canvas Interactions',
  CHANNEL_SPECIFIC_FEATURES = 'Channel Specific Features',
  METADATA = 'Metadata',
  DANGER_ZONE = 'Danger Zone',
  DIALOGFLOW_CONSOLE = 'Dialogflow Console',
  GLOBAL_LOGIC = 'Global Logic',
}

export const DEFAULT_MAX_WIDTH = 700;

export interface PlatformSettingsMetaProps {
  name: string;
  sections: SettingSections[];
  descriptors: {
    localesDescriptor?: React.ReactNode;
    continuePrevious?: React.ReactNode;
    allowRepeat?: React.ReactNode;
    repeatDialog?: React.ReactNode;
    repeatEverything?: React.ReactNode;
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
        SettingSections.METADATA,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        allowRepeat: <ContentDescriptors.AllowRepeat />,
        repeatDialog: <ContentDescriptors.RepeatDialog />,
        defaultVoice: <ContentDescriptors.DefaultVoice />,
        repeatEverything: <ContentDescriptors.RepeatEverything />,
        continuePrevious: <ContentDescriptors.ContinuePrevious />,
      },
      localeText: 'Locales',
    },
    [Platform.Constants.PlatformType.GOOGLE]: {
      name: 'Google',
      sections: [SettingSections.BASIC, SettingSections.GLOBAL_LOGIC, SettingSections.CANVAS, SettingSections.METADATA, SettingSections.DANGER_ZONE],
      descriptors: {
        allowRepeat: <ContentDescriptors.AllowRepeat />,
        repeatDialog: <ContentDescriptors.RepeatDialog />,
        repeatEverything: <ContentDescriptors.RepeatEverything />,
        continuePrevious: <ContentDescriptors.ContinuePrevious />,
        defaultVoice: <ContentDescriptors.DefaultVoice />,
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
        SettingSections.METADATA,
        SettingSections.DANGER_ZONE,
      ],
      descriptors: {
        repeatEverything: <ContentDescriptors.RepeatEverything />,
      },
      localeText: 'Language',
    },
    [Platform.Constants.ProjectType.CHAT]: {
      name: 'Chatbot',
      sections: [SettingSections.BASIC, SettingSections.GLOBAL_LOGIC, SettingSections.CANVAS, SettingSections.METADATA, SettingSections.DANGER_ZONE],
      descriptors: {},
    },
  },
  {
    name: 'ContentDescriptors',
    sections: [SettingSections.BASIC, SettingSections.GLOBAL_LOGIC, SettingSections.CANVAS, SettingSections.METADATA, SettingSections.DANGER_ZONE],
    descriptors: {
      defaultVoice: <ContentDescriptors.DefaultVoice />,
    },
  }
);
