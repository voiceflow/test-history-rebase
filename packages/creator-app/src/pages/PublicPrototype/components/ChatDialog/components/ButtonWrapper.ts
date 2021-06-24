import { Box, changeColorShade } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

const ButtonWrapper = styled(Box)<{ color?: string; disabled?: boolean; isMobile?: boolean }>`
  ${transition('color')}
  margin-left: 24px;

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  ${({ color, disabled }) =>
    color &&
    css`
      background-color: ${color};
      padding: 16px;
      border-radius: 12px;
      transition: 0.15s ease all;

      :hover {
        background-color: ${disabled ? color : changeColorShade(color, -20)};
      }
    `};

  ${({ isMobile }) =>
    isMobile &&
    css`
      padding: 10px;
    `}
`;

export default ButtonWrapper;
