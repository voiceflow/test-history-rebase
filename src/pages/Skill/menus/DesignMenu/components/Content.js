import { styled, transition } from '@/hocs';

import { Tab } from '../constants';

const Content = styled.div`
  display: flex;
  width: ${({ theme }) => theme.components.leftSidebar.contentWidth}px;
  height: 100%;
  flex-direction: column;
  background-color: ${({ activeTab }) => (activeTab === Tab.STEPS ? '#f9f9f9' : '#fff')};
  box-shadow: ${({ isOpen }) =>
    isOpen
      ? '0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06)'
      : '0 2px 4px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06)'};
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: hidden;

  ${transition('background-color', 'box-shadow')};
`;

export default Content;
