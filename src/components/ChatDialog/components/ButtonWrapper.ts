import Box from '@/components/Box';
import { css, styled } from '@/hocs';
import { changeColorShade } from '@/utils/colors';

const ButtonWrapper = styled(Box)<{ color?: string; disabled?: boolean }>`
  margin-left: 24px;

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  ${({ color }) =>
    color &&
    css`
      background-color: ${color};
      padding: 16px;
      border-radius: 12px;

      :hover {
        background-color: ${changeColorShade(color, -20)};
      }
    `};
`;

export default ButtonWrapper;
