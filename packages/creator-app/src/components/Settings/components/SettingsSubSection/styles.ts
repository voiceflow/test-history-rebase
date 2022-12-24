import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const LeftDescription = styled(Box)<{ radioButtonDescription?: boolean }>`
  padding-left: 24px;
  width: 318px;
  ${({ radioButtonDescription = false }) =>
    radioButtonDescription &&
    css`
      flex-grow: 1;
      align-self: flex-start;
    `}
`;
