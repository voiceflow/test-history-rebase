import { Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

interface CaretDownContainerProps {
  active?: boolean;
}

const CaretDownContainer = styled(Box.FlexCenter)<CaretDownContainerProps>`
  ${transition('color', 'opacity')}

  color: #6e849a;
  cursor: pointer;
  height: 16px;
  width: 16px;

  &:hover {
    opacity: 1;
    color: #3d82e2;
  }

  ${({ active }) =>
    active &&
    css`
      color: #3d82e2;
      opacity: 1;
    `}
`;

export default CaretDownContainer;
