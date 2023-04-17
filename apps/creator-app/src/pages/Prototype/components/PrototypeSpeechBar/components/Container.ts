import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const Container = styled(Box)<{ disabled?: boolean }>`
  width: 100%;
  margin: 0 auto;
  min-height: 178px;
  padding: 24px;
  position: relative;
  cursor: pointer;
  color: #8da2b5;
  user-select: none;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
    `}
`;

export default Container;
