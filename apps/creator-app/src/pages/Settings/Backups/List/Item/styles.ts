import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

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

export const ActionsItemContainer = styled.span`
  display: inline-block;
`;
