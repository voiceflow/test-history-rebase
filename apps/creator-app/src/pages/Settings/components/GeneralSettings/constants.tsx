import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import AlexaFeatures from '@/pages/Settings/components/GeneralSettings/Sections/ChannelSpecificFeatures';
import { SettingSections } from '@/pages/Settings/constants';

import { AIAssistant, Basic, Canvas, DangerZone, DialogflowConsole, GlobalLogic, Metadata } from './Sections';

export const SectionFeatureFlags: Partial<Record<SettingSections, Realtime.FeatureFlag>> = {
  [SettingSections.AI_ASSISTANT]: Realtime.FeatureFlag.ASSISTANT_AI,
};

export const SectionComponents: Record<
  SettingSections,
  React.FC<{ platform: Platform.Constants.PlatformType; projectType: Platform.Constants.ProjectType; title: SettingSections; platformMeta: any }>
> = {
  [SettingSections.BASIC]: Basic,
  [SettingSections.CANVAS]: Canvas,
  [SettingSections.GLOBAL_LOGIC]: GlobalLogic,
  [SettingSections.CHANNEL_SPECIFIC_FEATURES]: AlexaFeatures,
  [SettingSections.AI_ASSISTANT]: AIAssistant,
  [SettingSections.DANGER_ZONE]: DangerZone,
  [SettingSections.METADATA]: Metadata,
  [SettingSections.DIALOGFLOW_CONSOLE]: DialogflowConsole,
};
