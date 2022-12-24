import { css, styled } from '@/hocs/styled';
import { breakpoints } from '@/styles/breakpoints';

import { StyledButton } from '../../common';

const ViewPrototypeButton = styled(StyledButton)`
  min-height: 60px;
  margin-top: 16px;

  ${breakpoints({
    xs: css`
      min-width: 320px;
    `,
    sm: css`
      min-width: 420px;
    `,
  })}
`;

export default ViewPrototypeButton;
