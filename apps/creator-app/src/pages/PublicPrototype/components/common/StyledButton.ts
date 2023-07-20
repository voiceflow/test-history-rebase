import { Button, changeColorShade } from '@voiceflow/ui';
import { layout, space } from 'styled-system';

import { css, styled, transition } from '@/hocs/styled';

const StyledButton = styled(Button)<{ isActive?: boolean; color?: string }>`
  ${transition('background-color')};

  position: relative;
  color: white;
  font-weight: 600;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  height: 67px;

  background-color: ${({ color }) => color || '#3d82e2'};

  &:hover {
    background-color: ${({ color }) => changeColorShade(color || '#3d82e2', -20)};
  }

  ${({ isActive, color }) =>
    isActive &&
    css`
      background-color: ${changeColorShade(color || '#3d82e2', -20)};
    `}

  ${layout}
  ${space}
`;

export default StyledButton;
