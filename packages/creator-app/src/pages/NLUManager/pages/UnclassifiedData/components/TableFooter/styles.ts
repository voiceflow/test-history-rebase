import { styled } from '@/hocs/styled';

const SIDEBAR_WIDTH = 308;

export const FooterContainer = styled.div<{ position: 'sticky' | 'absolute' }>`
  background-color: rgba(255, 255, 255, 1);
  position: ${({ position }) => position};
  bottom: 0;
  width: ${`calc(100% - ${SIDEBAR_WIDTH}px)`};
  padding: 20px 27px;
  border-top: 1px solid rgba(223, 227, 237, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 63.5px;
  width: 100%;
`;
