import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const WaterMark = styled(Box)<{ centerAlign?: boolean }>`
  ${({ centerAlign }) =>
    centerAlign &&
    css`
      text-align: center;
    `}
`;

export default WaterMark;
