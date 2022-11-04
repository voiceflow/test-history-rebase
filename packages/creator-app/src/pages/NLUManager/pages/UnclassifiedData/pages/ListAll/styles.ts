import { Table } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const Dot = styled.div`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #62778c;
  margin-left: 8px;
  margin-right: 8px;
`;

export const RowButtons = styled.div`
  display: flex;
  align-items: center;
  visibility: hidden;
`;

export const UnclassifiedTableRow = styled(Table.Row)`
  height: 88px;
  display: flex;
  justify-content: space-between;

  &:hover {
    ${RowButtons} {
      visibility: visible;
    }
  }
`;

const SIDEBAR_WIDTH = 308;

export const UnclassifiedFooter = styled.div<{ position: 'sticky' | 'absolute' }>`
  background-color: rgba(255, 255, 255, 1);
  position: ${({ position }) => position};
  bottom: 0;
  width: ${`calc(100% - ${SIDEBAR_WIDTH}px)`};
  padding: 20px 32px;
  border-top: 1px solid rgba(223, 227, 237, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 63.5px;
  width: 100%;
`;

export const TopBadge = styled.div`
  position: absolute;
  left: 55%;
  z-index: 1;
  color: white;
  display: flex;
  align-items: center;
  padding-left: 13px;
  cursor: pointer;
  top: 10px;
  width: 68px;
  height: 32px;
  border-radius: 16px;
  background-color: #2b2f32;
`;
