import { css, styled } from '../../styles';
import { COLOR_BLUE } from '../../styles/constants';
import { VariantValue } from '../../types';
import Box from '../Box';

export enum AlertVariant {
  DEFAULT = 'default',
  DANGER = 'danger',
  WARNING = 'warning',
}

interface AlertProps {
  color: string;
  borderColor: string;
  backgroundColor: string;
}

const COLORS: Record<AlertVariant, AlertProps> = {
  [AlertVariant.DEFAULT]: { color: COLOR_BLUE, borderColor: '#5d9df515', backgroundColor: '#5d9df515' },
  [AlertVariant.DANGER]: { color: '#721c24', borderColor: '#f8d7da', backgroundColor: '#f8d7da' },
  [AlertVariant.WARNING]: { color: '#856404', borderColor: '#ffeeba', backgroundColor: '#fff3cd' },
};

const Alert = styled(Box)<{ variant?: VariantValue<AlertVariant> }>`
  ${({ variant = AlertVariant.DEFAULT }) => css`
    color: ${COLORS[variant].color};
    background: ${COLORS[variant].backgroundColor};
    border: 1px solid ${COLORS[variant].borderColor};
  `}
  position: relative;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
`;

Alert.defaultProps = {
  mb: '1rem',
};

export default Alert;
