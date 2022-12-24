import { Description as BaseDescription } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';
import { breakpoints } from '@/styles/breakpoints';

const Description = styled(BaseDescription)`
  ${breakpoints({
    xs: css`
      max-width: 320px;
    `,
    sm: css`
      min-width: 420px;
    `,
  })}
`;

export default Description;
