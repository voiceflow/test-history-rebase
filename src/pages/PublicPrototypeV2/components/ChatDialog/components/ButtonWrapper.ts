import Box from '@/components/Box';
import { css, styled, transition } from '@/hocs';
import { changeColorShade } from '@/utils/colors';

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
