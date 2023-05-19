import * as Platform from '@voiceflow/platform-config';

import AlexaFeatures from '@/pages/Settings/components/GeneralSettings/Sections/ChannelSpecificFeatures';
import { SettingSections } from '@/pages/Settings/constants';

import { Basic, Canvas, DangerZone, DialogflowConsole, GlobalLogic, Metadata } from './Sections';

export const SectionComponents: Record<
  SettingSections,
  React.FC<{ platform: Platform.Constants.PlatformType; projectType: Platform.Constants.ProjectType; title: SettingSections; platformMeta: any }>
> = {
  [SettingSections.BASIC]: Basic,
  [SettingSections.CANVAS]: Canvas,
  [SettingSections.GLOBAL_LOGIC]: GlobalLogic,
  [SettingSections.CHANNEL_SPECIFIC_FEATURES]: AlexaFeatures,
  [SettingSections.DANGER_ZONE]: DangerZone,
  [SettingSections.METADATA]: Metadata,
  [SettingSections.DIALOGFLOW_CONSOLE]: DialogflowConsole,
};
