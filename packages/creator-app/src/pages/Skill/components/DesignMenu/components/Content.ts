import { css, styled, transition } from '@/hocs';

import { Tab } from '../constants';

type ContentProps = {
  activeTab?: Tab;
  isOpen?: boolean;
  navigationRedesign?: boolean;
};

const Content = styled.div<ContentProps>`
  ${transition('background-color', 'box-shadow')};

  display: flex;
  width: ${({ theme }) => theme.components.leftSidebar.contentWidth}px;
  height: 100%;
  flex-direction: column;
  background-color: ${({ activeTab }) => (activeTab === Tab.STEPS ? '#f9f9f9' : '#fff')};
  overflow: hidden;

  box-shadow: ${({ isOpen }) =>
    isOpen
      ? '0 4px 8px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06)'
      : '0 2px 4px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06)'};

  ${({ navigationRedesign }) =>
    navigationRedesign
      ? css`
          border-radius: 6px;
        `
      : css`
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
        `}
`;

export default Content;
