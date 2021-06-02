import { Description as BaseDescription } from '@/components/Text';
import { css, styled } from '@/hocs';
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
