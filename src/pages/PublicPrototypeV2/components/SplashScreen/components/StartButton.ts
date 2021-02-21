import { styled, transition } from '@/hocs';
import { changeColorShade } from '@/utils/colors';

const StartButton = styled.button<{ color?: string }>`
  ${transition('color')};

  min-width: 260px;
  padding: 20px 48px;
  position: relative;
  color: white;
  font-weight: 600;
  font-size: 18px;
  border: none;
  border-radius: 12px;
  background-color: ${({ color, theme }) => color || theme.colors.blue};

  &:hover {
    background-color: ${({ color, theme }) => changeColorShade(color || theme.colors.blue, -20)};
  }
`;

export default StartButton;
