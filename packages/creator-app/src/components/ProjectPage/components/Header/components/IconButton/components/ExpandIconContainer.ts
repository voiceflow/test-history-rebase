import { BoxFlexCenter } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';
import { ClassName } from '@/styles/constants';

const activeStyles = css`
  opacity: 1;

  .${ClassName.SVG_ICON} {
    transform: translate(2px, 2px);
  }
`;

interface ExpandContainerProps {
  isActive?: boolean;
}

const ExpandIconContainer = styled(BoxFlexCenter)<ExpandContainerProps>`
  ${transition('opacity')}

  width: 15px;
  height: 15px;
  position: absolute;
  padding-right: 1px;
  padding-bottom: 1px;
  right: 0px;
  bottom: 0px;
  opacity: 0.6;
  z-index: 1;
  cursor: pointer;

  .${ClassName.SVG_ICON} {
    ${transition('transform')}
  }

  ${({ isActive }) => isActive && activeStyles}

  ${({ onClick }) =>
    !onClick &&
    css`
      pointer-events: none;
    `}

  &:hover {
    ${activeStyles}
  }
`;

export default ExpandIconContainer;
