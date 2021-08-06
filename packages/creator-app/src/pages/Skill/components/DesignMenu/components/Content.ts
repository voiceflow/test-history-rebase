import { styled, transition } from '@/hocs';

import { Tab } from '../constants';

interface ContentProps {
  activeTab?: Tab;
  isOpen?: boolean;
}

const Content = styled.div<ContentProps>`
  ${transition('background-color', 'box-shadow')};

  display: flex;
  width: ${({ theme }) => theme.components.leftSidebar.contentWidth}px;
  height: 100%;
  flex-direction: column;
  background-color: ${({ activeTab }) => (activeTab === Tab.STEPS ? '#f9f9f9' : '#fff')};
  overflow: hidden;
  border-radius: 6px;

  box-shadow: ${({ isOpen }) =>
    isOpen
      ? '0 4px 8px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06)'
      : '0 2px 4px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06)'};
`;

export default Content;
