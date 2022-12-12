import { Box, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';
import * as T from './types';

export * as CardTypes from './types';

const Card: React.FC<T.Props> = ({ title, badge, bubbles, onClick, isActive, description }) => (
  <S.Container onClick={() => onClick?.()} isActive={isActive}>
    <S.Title>{title}</S.Title>

    <S.Description>{description}</S.Description>

    {badge && <S.BadgeContainer>{badge}</S.BadgeContainer>}

    <Box.Flex>
      {bubbles.map(({ name, icon, color }, index) => (
        <TippyTooltip key={name} title={name} distance={4} bodyOverflow>
          <S.Bubble zIndex={bubbles.length - index}>
            <SvgIcon icon={icon} color={color} />
          </S.Bubble>
        </TippyTooltip>
      ))}
    </Box.Flex>
  </S.Container>
);

export default Card;
