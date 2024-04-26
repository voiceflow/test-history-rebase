import { Box, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Feature from '@/ducks/feature';
import { useSelector } from '@/hooks';
import { ClassName } from '@/styles/constants';

import type { ChannelMetaType } from '../../constants';
import { IconType, PLATFORM_FEATURE_META } from '../../constants';
import {
  Container,
  FeatureStatusBubble,
  IconImage,
  PlatformDescription,
  PlatformFeatureBubble,
  PlatformIcon,
  PlatformName,
} from './styles';

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
  isNew,
}) => {
  const getIsFeatureEnabled = useSelector(Feature.isFeatureEnabledSelector);
  const isComingSoon = comingSoon && (!featureFlag || !getIsFeatureEnabled(featureFlag));

  const featureStatusContent = React.useMemo(() => {
    const isComingSoon = comingSoon && (!featureFlag || !getIsFeatureEnabled(featureFlag));
    const isNewFeature = isNew && featureFlag && getIsFeatureEnabled(featureFlag);

    if (isComingSoon) return 'Coming soon';
    if (isNewFeature) return 'New';

    return null;
  }, [comingSoon, isNew, featureFlag]);

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
                <TippyTooltip key={featureID} content={tooltip} position="top">
                  <PlatformFeatureBubble color={color}>{name} </PlatformFeatureBubble>
                </TippyTooltip>
              );
            })}
          </div>
        )}
      </Container>

      {featureStatusContent && <FeatureStatusBubble>{featureStatusContent}</FeatureStatusBubble>}
    </Box>
  );
};

export default Card;
