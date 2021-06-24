import { changeColorShade } from '@voiceflow/ui';
import { layout, space } from 'styled-system';

import { styled, transition } from '@/hocs';

const StyledButton = styled.button`
  ${transition('background-color')};

  position: relative;
  color: white;
  font-weight: 600;
  font-size: 18px;
  border: none;
  border-radius: 8px;

  background-color: ${({ color, theme }) => color || theme.colors.blue};

  &:hover {
    background-color: ${({ color, theme }) => changeColorShade(color || theme.colors.blue, -20)};
  }

  ${layout}
  ${space}
`;

export default StyledButton;
