import React from 'react';

import { PlatformType } from '@/constants';

import { Alexa, General, Google, Universal } from './components/ContentDescriptors';

export enum SettingSections {
  BASIC = 'Basic',
  CANVAS = 'Canvas',
  GLOBAL_CONVERSATION_LOGIC = 'Global Conversation Logic',
  CHANNEL_SPECIFIC_FEATURES = 'Channel Specific Features',
  DANGER_ZONE = 'Danger Zone',
}

export enum SettingsTabsType {
  GENERAL = 'general',
  VERSIONS = 'versions',
}

export type PlatformSettingsMetaProps = {
  name: string;
  sections: SettingSections[];
  descriptors: {
    projectName: React.FC | string;
    invocationName: React.FC | string;
    localesDescriptor: React.FC | string;
    continuePrevious: React.FC | string;
    allowRepeat: React.FC | string;
    gadgets?: React.FC | string;
    events?: React.FC | string;
    repeatDialog?: any;
    repeatEverything?: any;
  };
  tabs: SettingsTabsType[];
  localeText?: string;
};

export const PLATFORM_SETTINGS_META = <Record<PlatformType, PlatformSettingsMetaProps>>{
  [PlatformType.ALEXA]: {
    name: 'Alexa',
    sections: [
      SettingSections.BASIC,
      SettingSections.CANVAS,
      SettingSections.GLOBAL_CONVERSATION_LOGIC,
      SettingSections.CHANNEL_SPECIFIC_FEATURES,
      SettingSections.DANGER_ZONE,
    ],
    descriptors: {
      projectName: Alexa.ProjectName,
      invocationName: Alexa.InvocationName,
      localesDescriptor: Alexa.Locales,
      continuePrevious: Universal.ContinuePrevious,
      allowRepeat: Universal.AllowRepeat,
      gadgets: Alexa.Gadgets,
      events: Alexa.Events,
      repeatDialog: General.RepeatDialog,
      repeatEverything: General.RepeatEverything,
    },
    tabs: [SettingsTabsType.GENERAL, SettingsTabsType.VERSIONS],
    localeText: 'Locales',
  },
  [PlatformType.GOOGLE]: {
    name: 'Google',
    sections: [SettingSections.BASIC, SettingSections.CANVAS, SettingSections.GLOBAL_CONVERSATION_LOGIC, SettingSections.DANGER_ZONE],
    descriptors: {
      projectName: Google.ProjectName,
      invocationName: Google.InvocationName,
      localesDescriptor: Google.Locales,
      continuePrevious: Universal.ContinuePrevious,
      allowRepeat: Universal.AllowRepeat,
      repeatDialog: General.RepeatDialog,
      repeatEverything: General.RepeatEverything,
    },
    tabs: [SettingsTabsType.GENERAL, SettingsTabsType.VERSIONS],
    localeText: 'Language',
  },
  [PlatformType.GENERAL]: {
    name: 'General',
    sections: [SettingSections.BASIC, SettingSections.DANGER_ZONE],
    descriptors: {
      projectName: General.ProjectName,
    },
    tabs: [SettingsTabsType.GENERAL],
  },
};
