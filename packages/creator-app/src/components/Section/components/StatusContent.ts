import { Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const StatusContent = styled(Flex)<{ overflowHidden?: boolean }>`
  color: #8da2b5;
  font-size: 13px;

  ${({ overflowHidden }) =>
    overflowHidden &&
    css`
      overflow-x: hidden;
    `}
`;

export default StatusContent;
