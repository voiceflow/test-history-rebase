import { IS_SAFARI } from '@voiceflow/ui';

import { ResizablePanel } from '@/components/Resizable';
import { css, styled, transition } from '@/hocs';

import { Tab } from '../constants';

interface ResizePanelProps {
  isOpen?: boolean;
  locked?: boolean;
  activeTab?: Tab;
}

const ResizePanel = styled(ResizablePanel)<ResizePanelProps>`
  ${transition('background-color')};

  position: relative;
  width: ${({ theme }) => theme.components.leftSidebar.contentWidth}px;
  height: 100%;
  pointer-events: auto;

  background-color: ${({ activeTab }) => (activeTab === Tab.STEPS ? '#f9f9f9' : '#fff')};
  border-radius: 6px;

  box-shadow: ${({ isOpen }) =>
    isOpen
      ? '0 4px 8px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06)'
      : '0 2px 4px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06)'};

  ${IS_SAFARI &&
  css`
    transform: translateZ(0);
  `}

  ${({ isOpen }) =>
    !isOpen &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: ${({ theme }) => -theme.components.leftSidebar.hiddenWidth}px;
        bottom: 0;
        width: ${({ theme }) => theme.components.leftSidebar.hiddenWidth}px;
        pointer-events: auto;
      }
    `}

  &::after {
    ${transition('opacity')}

    display: block;
    width: 4px;
    height: 20px;

    position: absolute;
    top: 50%;
    right: ${({ theme }) => -theme.components.leftSidebar.hiddenWidth + 2}px;

    border-radius: 3px;
    opacity: 0.5;
    background-image: linear-gradient(to bottom, rgba(110, 132, 154, 0.85), #6e849a);

    content: '';
    pointer-events: none;

    ${({ locked }) =>
      locked &&
      css`
        opacity: 0;
      `}
  }
`;

export default ResizePanel;
