import { styled, units } from '@ui/styles';

import Box from '../../Box';

export interface ActionsContainerProps {
  unit?: number;
  isLeft?: boolean;
  offsetUnit?: number;
}

const ActionsContainer = styled(Box.FlexCenter)<ActionsContainerProps>`
  margin: ${({ theme, isLeft, unit = 1.25, offsetUnit = 1.5 }) =>
    isLeft
      ? `0 ${units(offsetUnit)({ theme })}px 0 ${units(-unit)({ theme })}px`
      : `0 ${units(-unit)({ theme })}px 0 ${units(offsetUnit)({ theme })}px`};
`;

export default ActionsContainer;
