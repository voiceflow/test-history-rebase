import { Box, colors, ThemeColor } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const IconContainer = styled(Box.FlexCenter)`
  height: 42px;
  width: 42px;
  border-radius: 6px;
  background: linear-gradient(180deg, #eef4f6 85%, #eef4f6 100%);
  flex-shrink: 0;
  color: ${colors(ThemeColor.PRIMARY)};
`;

export const ArrowContainer = styled.div<{ isOpen?: boolean }>`
  ${transition('transform', 'opacity')}

  opacity: 0.65;
  transform: rotate(90deg);
  color: ${({ color, theme }) => color ?? theme.iconColors.active};

  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: rotate(180deg);
      opacity: 0.85;
    `}
`;

export const Body = styled.div`
  border-top: 1px solid #eaeff4;
  padding: 24px 32px;
`;

export const Header = styled.div`
  &:hover ${ArrowContainer} {
    opacity: 0.85;
  }
`;
