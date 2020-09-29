import React from 'react';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';

import { IconType, PLATFORM_FEATURE_META, PlatformMetaType } from '../../../constants';
import { Container, FeaturesContainer, IconImage, PlatformDescription, PlatformFeatureBubble, PlatformIcon, PlatformName } from './components';

type PlatformCard = {
  platformMeta: PlatformMetaType;
  onClick: () => void;
  disabled?: boolean;
};

const PlatformCard: React.FC<PlatformCard> = ({ platformMeta, onClick, disabled }) => {
  return (
    <Container onClick={onClick} disabled={disabled}>
      <PlatformIcon>
        {platformMeta.iconType === IconType.ICON ? (
          <SvgIcon icon={platformMeta.icon || 'speak'} size={platformMeta.iconSize} color={platformMeta.iconColor} />
        ) : (
          <IconImage src={platformMeta.icon} size={platformMeta.iconSize} alt="platformIcon" />
        )}
      </PlatformIcon>
      <PlatformName>{platformMeta.name}</PlatformName>
      <PlatformDescription>{platformMeta.description}</PlatformDescription>
      <FeaturesContainer>
        {platformMeta.features.map((featureID) => {
          const { color, borderColor, name, description } = PLATFORM_FEATURE_META[featureID];
          return (
            <Tooltip key={featureID} title={description(platformMeta.platformName)} position="top">
              <PlatformFeatureBubble color={color} borderColor={borderColor}>
                {name}{' '}
              </PlatformFeatureBubble>
            </Tooltip>
          );
        })}
      </FeaturesContainer>
    </Container>
  );
};

export default PlatformCard;
