import { Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const Container = styled(Box.FlexEnd)<{ rowHovered?: boolean }>`
  ${transition('opacity')}

  width: 100%;
  padding-right: 12px;
  opacity: 0;

  ${({ rowHovered }) =>
    rowHovered &&
    css`
      opacity: 1;
    `}
`;
