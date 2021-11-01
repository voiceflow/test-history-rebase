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
  opacity: 0.6;

  .${ClassName.SVG_ICON} {
    transform: translateY(2px);
    ${transition('transform')}
  }

  &:hover {
    opacity: 1;

    .${ClassName.SVG_ICON} {
      transform: translateY(4px);
    }
  }

  ${({ active }) =>
    active &&
    css`
      color: #132144;
      opacity: 1;

      .${ClassName.SVG_ICON} {
        transform: translateY(4px);
      }
    `}
`;

export default CaretDownContainer;
