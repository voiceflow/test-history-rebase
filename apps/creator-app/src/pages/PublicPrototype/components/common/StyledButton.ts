import { changeColorShade } from '@voiceflow/ui';
import { layout, space } from 'styled-system';

import { styled, transition } from '@/hocs/styled';

const StyledButton = styled.button`
  ${transition('background-color')};

  position: relative;
  color: white;
  font-weight: 600;
  font-size: 18px;
  border: none;
  border-radius: 8px;

  background-color: ${({ color }) => color || '#3d82e2'};

  &:hover {
    background-color: ${({ color }) => changeColorShade(color || '#3d82e2', -20)};
  }

  ${layout}
  ${space}
`;

export default StyledButton;
