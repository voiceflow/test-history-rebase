import { Title as BaseTitle } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';
import { breakpoints } from '@/styles/breakpoints';

const Title = styled(BaseTitle)`
  ${breakpoints({
    xs: css`
      max-width: 320px;
    `,
    sm: css`
      min-width: 420px;
    `,
  })}
`;

export default Title;
