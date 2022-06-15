import { css, styled } from '@ui/styles';
import { COLOR_BLUE } from '@ui/styles/constants';

import { Box, BoxProps } from '../Box';

enum Variant {
  DANGER = 'danger',
  DEFAULT = 'default',
  WARNING = 'warning',
  UNSTYLED = 'unstyled',
}

const COLORS = {
  [Variant.DANGER]: css`
    color: #721c24;
    background: #f8d7da;
    border-color: #f8d7da;
  `,

  [Variant.DEFAULT]: css`
    color: ${COLOR_BLUE};
    background: #5d9df515;
    border-color: #5d9df515;
  `,

  [Variant.WARNING]: css`
    color: #856404;
    background: #fff3cd;
    border-color: #ffeeba;
  `,

  [Variant.UNSTYLED]: css``,
};

interface AlertProps {
  variant?: Variant;
}

const Alert = styled(Box).attrs<BoxProps>(({ mb = '1rem' }) => ({ mb }))<AlertProps>`
  position: relative;
  padding: 0.75rem 1.25rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;

  ${({ variant = Variant.DEFAULT }) => COLORS[variant]}
`;

export default Object.assign(Alert, {
  Variant,
});
