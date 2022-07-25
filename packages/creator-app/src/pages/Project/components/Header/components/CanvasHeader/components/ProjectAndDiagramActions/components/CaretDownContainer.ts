import { BoxFlexCenter } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';
import { ClassName } from '@/styles/constants';

interface CaretDownContainerProps {
  active?: boolean;
}

const CaretDownContainer = styled(BoxFlexCenter)<CaretDownContainerProps>`
  ${transition('color', 'opacity')}

  padding: 12px 8px;
  color: #6e849a;
  cursor: pointer;

  .${ClassName.SVG_ICON} {
    opacity: 0.8;
    transform: translateY(2px) rotate(90deg);
    ${transition('transform', 'color')}
  }

  &:hover {
    .${ClassName.SVG_ICON} {
      opacity: 1;
      transform: translateY(4px) rotate(90deg);
    }
  }

  ${({ active }) =>
    active &&
    css`
      color: #132144;
      opacity: 1;

      .${ClassName.SVG_ICON} {
        transform: translateY(4px) rotate(90deg);
      }
    `}
`;

export default CaretDownContainer;
