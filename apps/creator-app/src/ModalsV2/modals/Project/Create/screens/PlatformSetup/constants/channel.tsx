import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { MenuItemGrouped, SvgIconTypes, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

export interface Option {
  id: string;
  name: string;
  icon: SvgIconTypes.Icon;
  type: Platform.Constants.ProjectType;
  tooltip: TippyTooltipProps | null;
  disabled: boolean;
  platform: Platform.Constants.PlatformType;
  iconColor?: string;
  featureFlag?: Realtime.FeatureFlag;
  notFeatureFlag?: Realtime.FeatureFlag;
}

type Config<Type extends Platform.Constants.ProjectType> = Pick<Platform.Base.Config, 'type'> & {
  types: {
    [Key in Type]: Pick<Platform.Base.Type.Config, 'name' | 'icon' | 'logo' | 'description'>;
  };
};

export const getID = ({ type, platform }: Pick<Option, 'type' | 'platform'>) => `${platform}::${type}`;

const buildOptionFactory =
  <Type extends Platform.Constants.ProjectType>(type: Type) =>
  (
    config: Config<Type>,
    {
      featureFlag,
      notFeatureFlag,
      isDeprecated,
    }: { isDeprecated?: boolean; featureFlag?: Realtime.FeatureFlag; notFeatureFlag?: Realtime.FeatureFlag } = {}
  ): Option => {
    return {
      id: getID({ type, platform: config.type }),
      name: config.types[type].name,
      icon: config.types[type].logo ?? config.types[type].icon.name,
      type,
      tooltip: {
        width: 232,
        style: { display: 'block', width: '100%' },
        offset: [0, 10],
        content: <TippyTooltip.Complex title={config.types[type].name}>{config.types[type].description}</TippyTooltip.Complex>,
        position: 'right',
      },
      disabled: !!isDeprecated,
      platform: config.type,
      iconColor: config.types[type].logo ? undefined : config.types[type].icon.color,
      featureFlag,
      notFeatureFlag,
    };
  };

const buildChatOption = buildOptionFactory(Platform.Constants.ProjectType.CHAT);
const buildVoiceOption = buildOptionFactory(Platform.Constants.ProjectType.VOICE);

export const OPTIONS: MenuItemGrouped<Option>[] = [
  {
    id: 'chatbot-sms',
    label: 'Chatbot & SMS',
    options: [
      buildChatOption(Platform.Webchat.CONFIG),
      buildChatOption(Platform.SMS.CONFIG),
      buildChatOption(Platform.Whatsapp.CONFIG),
      buildChatOption(Platform.MicrosoftTeams.CONFIG),
    ],
  },
  {
    id: 'voice-ivr',
    label: 'Voice & IVR',
    options: [
      buildVoiceOption(Platform.Alexa.CONFIG, { notFeatureFlag: Realtime.FeatureFlag.ALEXA_DEPRECATED }),
      buildVoiceOption(Platform.Alexa.Deprecated.CONFIG, { featureFlag: Realtime.FeatureFlag.ALEXA_DEPRECATED, isDeprecated: true }),
    ],
  },
];

export const OPTIONS_MAP = Object.fromEntries(OPTIONS.flatMap((group) => group.options ?? []).map((option) => [option.id, option]));

export const getConfig = (platform?: Platform.Constants.PlatformType | null) => {
  if (Platform.Config.isSupported(platform)) return Platform.Config.get(platform);

  return null;
};
