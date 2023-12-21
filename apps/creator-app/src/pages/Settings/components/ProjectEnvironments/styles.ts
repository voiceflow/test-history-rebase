import { Box, Flex } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const RowItem = styled(Box.FlexCenter)<{ hasBorder?: boolean }>`
  font-size: 15px;
  display: flex;
  min-height: unset;
  padding: 16px 32px;
  gap: 32px;

  ${({ hasBorder }) =>
    hasBorder &&
    css`
      border-bottom: solid 1px #eaeff4;
    `}
`;

export const ColumnItemContainer = styled.span`
  ::first-letter {
    text-transform: capitalize;
  }

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

export interface StatusIndicatorProps {
  size: number;
  isLive: boolean;
}

export const StatusIndicator = styled.div<StatusIndicatorProps>`
  ${transition('transform')}

  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: ${({ isLive }) => (isLive ? '#50a82e' : '#c5d3e0')} solid 1px;
  transform: translateY(1px);
  box-shadow: 0 1px 0 0 rgba(17, 49, 96, 0.08);
  margin-right: 8px;
  border-radius: 50%;
  background-color: ${({ isLive }) => (isLive ? '#e7f6e2' : '#f8fafc')};
`;

export const StatusIndicatorContainer = styled(Flex)`
  flex-direction: row;
  font-size: 13px;
  cursor: pointer;
  justify-content: flex-end;
  align-items: baseline;
`;

export const ActionsItemContainer = styled.span`
  display: inline-block;
`;

export const TableHeader = styled(Box.FlexCenter)`
  display: flex;
  color: #62778c;
  font-size: 13px;
  padding: 18px 32px;
  gap: 32px;
`;

const getColumnStyles = (columns: number[]) =>
  columns.map(
    (column, index) => css`
      & > :nth-child(${index + 1}) {
        flex: ${column};
      }
    `
  );

export const TableContainer = styled(Box)<{ columns: number[] }>`
  ${({ columns }) => getColumnStyles(columns)}

  ${TableHeader}, ${RowItem} {
    display: flex;
    justify-content: center;
    border-bottom: solid 1px #eaeff4;

    ${({ columns }) => columns && getColumnStyles(columns)}
  }

  ${RowItem}:last-child {
    border-bottom: none;
  }
`;

export const Heading = styled.div`
  font-size: 13px;
  color: #62778c;
  padding: 20px 32px;
  background: #fdfdfd;
`;

export const HotKeyContainer = styled.span`
  color: black;
  font-weight: 600;
`;
