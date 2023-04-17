import { Input } from '@voiceflow/ui';

import { css, keyframes, styled } from '@/hocs/styled';
import { ANIMATION_SPEED } from '@/styles/theme';

const widthAnimation = keyframes`
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
`;

export const InputContainer = styled.div<{ animateIn?: boolean }>`
  ${({ animateIn }) =>
    animateIn &&
    css`
      animation: ${widthAnimation} ${ANIMATION_SPEED}s ease;
      transform-origin: right;
    `}
`;

export const StyledInput = styled(Input)<{ noBorder?: boolean; width?: number }>`
  ${({ noBorder }) =>
    noBorder &&
    css`
      border: none;
      box-shadow: none;
      padding: 10px 16px 10px 0;

      &:active,
      &:focus,
      &:focus-within {
        border: none;
        box-shadow: none;
      }
    `}

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}
`;
