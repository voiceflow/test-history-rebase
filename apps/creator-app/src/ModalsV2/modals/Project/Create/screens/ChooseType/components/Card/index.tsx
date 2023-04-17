import { Box, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';
import * as T from './types';

export * as CardTypes from './types';

const Card: React.FC<T.Props> = ({ title, badge, bubbles, onClick, onDoubleClick, isActive, description }) => (
  <S.Container onClick={() => onClick?.()} onDoubleClick={onDoubleClick} isActive={isActive}>
    <S.Title>{title}</S.Title>

    <S.Description>{description}</S.Description>

    {badge && <S.BadgeContainer>{badge}</S.BadgeContainer>}

    <Box.Flex>
      {bubbles.map(({ name, icon, color }, index) => (
        <TippyTooltip key={name} content={name} offset={[0, 4]}>
          <S.Bubble zIndex={bubbles.length - index}>
            <SvgIcon icon={icon} color={color} />
          </S.Bubble>
        </TippyTooltip>
      ))}
    </Box.Flex>
  </S.Container>
);

export default Card;
