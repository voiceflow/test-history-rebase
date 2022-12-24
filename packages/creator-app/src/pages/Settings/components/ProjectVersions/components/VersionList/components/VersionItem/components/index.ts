import { Flex } from '@voiceflow/ui';

import { StatusIndicator } from '@/components/Indicator';
import { TableRow } from '@/components/Table';
import { styled } from '@/hocs/styled';

export const RowItem = styled(TableRow)`
  display: flex;
  min-height: unset;
  padding: 16px 32px;
  gap: 32px;
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

export enum PublishIndicatorVariant {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export const borderColorMap = {
  [PublishIndicatorVariant.PRODUCTION]: '#50a82e',
  [PublishIndicatorVariant.DEVELOPMENT]: '#c5d3e0',
};

export const bgGradientMap = {
  [PublishIndicatorVariant.PRODUCTION]: '#e7f6e2',
  [PublishIndicatorVariant.DEVELOPMENT]: '#f8fafc',
};

export const StatusIndicatorContainer = styled(Flex)`
  flex-direction: row;
  font-size: 13px;
  cursor: pointer;
  justify-content: flex-end;
  align-items: baseline;

  ${StatusIndicator} {
    margin-right: 8px;
    transform: translateY(1px);
  }
`;

export const ActionsItemContainer = styled.span`
  display: inline-block;
`;
