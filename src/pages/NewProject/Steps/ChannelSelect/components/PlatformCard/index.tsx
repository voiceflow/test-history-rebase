import React from 'react';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';

import { ChannelMetaType, IconType, PLATFORM_FEATURE_META } from '../../../constants';
import { Container, FeaturesContainer, IconImage, PlatformDescription, PlatformFeatureBubble, PlatformIcon, PlatformName } from './components';

type PlatformCard = {
  channel: ChannelMetaType;
  onClick: () => void;
  disabled?: boolean;
};

const PlatformCard: React.FC<PlatformCard> = ({ channel, onClick, disabled }) => (
  <Container onClick={onClick} disabled={disabled}>
    <PlatformIcon>
      {channel.iconType === IconType.ICON ? (
        <SvgIcon icon={channel.icon || 'speak'} size={channel.iconSize} color={channel.iconColor} />
      ) : (
        <IconImage src={channel.icon} size={channel.iconSize} alt="platformIcon" />
      )}
    </PlatformIcon>
    <PlatformName>{channel.name}</PlatformName>
    <PlatformDescription>{channel.description}</PlatformDescription>
    <FeaturesContainer>
      {channel.features.map((featureID) => {
        const { color, borderColor, name, description } = PLATFORM_FEATURE_META[featureID];
        return (
          <Tooltip key={featureID} title={description(channel.channel)} position="top">
            <PlatformFeatureBubble color={color} borderColor={borderColor}>
              {name}{' '}
            </PlatformFeatureBubble>
          </Tooltip>
        );
      })}
    </FeaturesContainer>
  </Container>
);

export default PlatformCard;
