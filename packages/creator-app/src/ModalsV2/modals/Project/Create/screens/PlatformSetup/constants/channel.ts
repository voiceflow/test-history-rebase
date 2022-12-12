import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { MenuItemGrouped, SvgIconTypes, TippyTooltipProps } from '@voiceflow/ui';

import { getLabelTooltip } from '@/components/UpgradeOption';

import { Upcoming } from '../../../constants';

export type UnionPlatform = Upcoming.Constants.PlatformType | Platform.Constants.PlatformType;

export interface Option {
  id: string;
  name: string;
  icon: SvgIconTypes.Icon;
  type: Platform.Constants.ProjectType;
  tooltip: TippyTooltipProps | null;
  disabled: boolean;
  platform: UnionPlatform;
  iconColor?: string;
  featureFlag?: Realtime.FeatureFlag;
}

type UnionConfig<Type extends Platform.Constants.ProjectType> = Omit<Upcoming.Base.Config | Platform.Base.Config, 'types'> & {
  types: {
    [Key in Type]: Omit<Platform.Base.Type.Config, 'adapters' | 'utils'>;
  };
};

export const getID = ({ type, platform }: Pick<Option, 'type' | 'platform'>) => `${platform}::${type}`;

const buildOptionFactory =
  <Type extends Platform.Constants.ProjectType>(type: Type) =>
  (config: UnionConfig<Type>, { featureFlag }: { featureFlag?: Realtime.FeatureFlag } = {}): Option => {
    const isUpcoming = Upcoming.Config.isSupported(config.type);

    return {
      id: getID({ type, platform: config.type }),
      name: config.types[type].name,
      icon: config.types[type].logo ?? config.types[type].icon.name,
      type,
      tooltip: isUpcoming ? null : getLabelTooltip(config.types[type].name, config.types[type].description),
      disabled: isUpcoming,
      platform: config.type,
      iconColor: config.types[type].logo ? undefined : config.types[type].icon.color,
      featureFlag,
    };
  };

const buildChatOption = buildOptionFactory(Platform.Constants.ProjectType.CHAT);
const buildVoiceOption = buildOptionFactory(Platform.Constants.ProjectType.VOICE);

export const OPTIONS: MenuItemGrouped<Option>[] = [
  {
    id: 'chatbot-sms',
    label: 'Chatbot & SMS',
    options: [
      buildChatOption(Platform.Webchat.CONFIG, { featureFlag: Realtime.FeatureFlag.WEBCHAT }),
      buildChatOption(Platform.Whatsapp.CONFIG, { featureFlag: Realtime.FeatureFlag.WHATSAPP }),
      buildChatOption(Platform.MicrosoftTeams.CONFIG, { featureFlag: Realtime.FeatureFlag.MICROSOFT_TEAMS }),
    ],
  },
  {
    id: 'voice-ivr',
    label: 'Voice & IVR',
    options: [buildVoiceOption(Platform.Alexa.CONFIG), buildVoiceOption(Platform.Google.CONFIG)],
  },
  {
    id: 'coming-soon',
    label: 'Coming Soon',
    options: [
      buildChatOption(Upcoming.Whatsapp.CONFIG, { featureFlag: Realtime.FeatureFlag.WHATSAPP }),
      buildChatOption(Upcoming.MicrosoftTeams.CONFIG, { featureFlag: Realtime.FeatureFlag.MICROSOFT_TEAMS }),
      buildChatOption(Upcoming.Facebook.CONFIG),
      buildChatOption(Upcoming.Twilio.CONFIG),
      buildVoiceOption(Upcoming.Twilio.CONFIG),
    ],
  },
];

export const OPTIONS_MAP = Object.fromEntries(OPTIONS.flatMap((group) => group.options ?? []).map((option) => [option.id, option]));

export const getConfig = (platform?: UnionPlatform | null) => {
  if (Upcoming.Config.isSupported(platform)) return Upcoming.Config.get(platform);
  if (Platform.Config.isSupported(platform)) return Platform.Config.get(platform);

  return null;
};
