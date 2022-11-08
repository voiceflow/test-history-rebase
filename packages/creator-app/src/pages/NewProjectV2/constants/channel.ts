import * as Platform from '@voiceflow/platform-config';
import { MenuItemGrouped, TippyTooltipProps } from '@voiceflow/ui';

import { getLabelTooltip } from '@/components/UpgradeOption';

import * as Upcoming from './upcoming';

export type UnionPlatform = Upcoming.Constants.PlatformType | Platform.Constants.PlatformType;

export interface Option {
  id: string;
  name: string;
  type: Platform.Constants.ProjectType;
  tooltip: TippyTooltipProps | null;
  disabled: boolean;
  platform: UnionPlatform;
}

type UnionConfig<Type extends Platform.Constants.ProjectType> = Omit<Upcoming.Base.Config | Platform.Base.Config, 'types'> & {
  types: {
    [Key in Type]: Omit<Platform.Base.Type.Config, 'adapters'>;
  };
};

export const getID = ({ type, platform }: Pick<Option, 'type' | 'platform'>) => `${platform}::${type}`;

const buildOptionFactory =
  <Type extends Platform.Constants.ProjectType>(type: Type) =>
  (config: UnionConfig<Type>): Option => {
    const isUpcoming = Upcoming.Config.isSupported(config.type);

    return {
      id: getID({ type, platform: config.type }),
      name: config.types[type].name,
      type,
      tooltip: isUpcoming ? null : getLabelTooltip(config.types[type].name, config.types[type].description),
      disabled: isUpcoming,
      platform: config.type,
    };
  };

const buildChatOption = buildOptionFactory(Platform.Constants.ProjectType.CHAT);
const buildVoiceOption = buildOptionFactory(Platform.Constants.ProjectType.VOICE);

export const OPTIONS: MenuItemGrouped<Option>[] = [
  {
    id: 'custom',
    label: 'Custom',
    options: [buildChatOption(Platform.Voiceflow.CONFIG), buildVoiceOption(Platform.Voiceflow.CONFIG)],
  },
  {
    id: 'channels',
    label: 'Channels',
    options: [buildChatOption(Platform.Webchat.CONFIG), buildVoiceOption(Platform.Alexa.CONFIG), buildVoiceOption(Platform.Google.CONFIG)],
  },
  {
    id: 'coming-soon',
    label: 'Coming Soon',
    options: [
      buildChatOption(Upcoming.Whatsapp.CONFIG),
      buildChatOption(Upcoming.Facebook.CONFIG),
      buildVoiceOption(Upcoming.Twilio.CONFIG),
      buildChatOption(Upcoming.Twilio.CONFIG),
    ],
  },
];

export const OPTIONS_MAP = Object.fromEntries(OPTIONS.flatMap((group) => group.options ?? []).map((option) => [option.id, option]));

export const getConfig = (platform?: UnionPlatform) => {
  if (Upcoming.Config.isSupported(platform)) return Upcoming.Config.get(platform);
  if (Platform.Config.isSupported(platform)) return Platform.Config.get(platform);

  return null;
};
