import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { Tooltip } from 'react-tippy';

import * as Feature from '@/ducks/feature';
import { useSelector } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { ChannelMetaType, IconType, PLATFORM_FEATURE_META } from '../../../constants';
import { ComingSoonBubble, Container, IconImage, PlatformDescription, PlatformFeatureBubble, PlatformIcon, PlatformName } from './components';

interface CardProps extends ChannelMetaType {
  onClick: () => void;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  icon,
  name,
  onClick,
  disabled,
  features,
  iconType,
  iconSize,
  platform,
  iconColor,
  comingSoon,
  featureFlag,
  description,
}) => {
  const getIsFeatureEnabled = useSelector(Feature.isFeatureEnabledSelector);
  const isComingSoon = comingSoon && (!featureFlag || !getIsFeatureEnabled(featureFlag));

  return (
    <Box position="relative">
      <Container className={ClassName.PLATFORM_CARD} onClick={onClick} disabled={isComingSoon || disabled}>
        <PlatformIcon>
          {iconType === IconType.ICON ? (
            <SvgIcon icon={icon} size={iconSize} color={iconColor} />
          ) : (
            <IconImage src={icon} size={iconSize} alt="platformIcon" />
          )}
        </PlatformIcon>

        <PlatformName>{name}</PlatformName>

        <PlatformDescription>{description}</PlatformDescription>

        {!isComingSoon && (
          <div>
            {features.map((featureID) => {
              const { name, color, description } = PLATFORM_FEATURE_META[featureID];

              const tooltip = typeof description === 'string' ? description : description(platform);

              return (
                <Tooltip key={featureID} title={tooltip} position="top">
                  <PlatformFeatureBubble color={color}>{name} </PlatformFeatureBubble>
                </Tooltip>
              );
            })}
          </div>
        )}
      </Container>

      {isComingSoon && <ComingSoonBubble>Coming soon</ComingSoonBubble>}
    </Box>
  );
};

export default Card;
