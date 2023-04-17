import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { MenuItemGrouped, SvgIconTypes, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

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

type UnionConfig<Type extends Platform.Constants.ProjectType> = Pick<Upcoming.Base.Config | Platform.Base.Config, 'type'> & {
  types: {
    [Key in Type]: Pick<Platform.Base.Type.Config, 'icon' | 'name' | 'logo' | 'description'>;
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
      tooltip: isUpcoming
        ? null
        : {
            width: 232,
            style: { display: 'block', width: '100%' },
            offset: [0, 10],
            content: <TippyTooltip.Complex title={config.types[type].name}>{config.types[type].description}</TippyTooltip.Complex>,
            position: 'right',
          },
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
      buildChatOption(Platform.Webchat.CONFIG),
      buildChatOption(Platform.SMS.CONFIG),
      buildChatOption(Platform.Whatsapp.CONFIG),
      buildChatOption(Platform.MicrosoftTeams.CONFIG),
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
    options: [buildChatOption(Upcoming.Facebook.CONFIG), buildVoiceOption(Upcoming.Twilio.CONFIG)],
  },
];

export const OPTIONS_MAP = Object.fromEntries(OPTIONS.flatMap((group) => group.options ?? []).map((option) => [option.id, option]));

export const getConfig = (platform?: UnionPlatform | null) => {
  if (Upcoming.Config.isSupported(platform)) return Upcoming.Config.get(platform);
  if (Platform.Config.isSupported(platform)) return Platform.Config.get(platform);

  return null;
};
