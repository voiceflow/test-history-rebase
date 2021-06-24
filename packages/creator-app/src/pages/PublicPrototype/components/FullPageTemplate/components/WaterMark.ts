import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

const WaterMark = styled(Box)<{ centerAlign?: boolean }>`
  ${({ centerAlign }) =>
    centerAlign &&
    css`
      text-align: center;
    `}
`;

export default WaterMark;
