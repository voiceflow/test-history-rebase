import { Box } from '@/components/Box';
import { css, styled } from '@/hocs/styled';

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

const AlertColors: Record<AlertVariant, AlertProps> = {
  [AlertVariant.DEFAULT]: { color: '#5d9df5', borderColor: '#5d9df515', backgroundColor: '#5d9df515' },
  [AlertVariant.DANGER]: { color: '#721c24', borderColor: '#f8d7da', backgroundColor: '#f8d7da' },
  [AlertVariant.WARNING]: { color: '#856404', borderColor: '#ffeeba', backgroundColor: '#fff3cd' },
};

const Alert = styled(Box)<{ variant?: AlertVariant }>`
  ${({ variant = AlertVariant.DEFAULT }) => css`
    color: ${AlertColors[variant].color};
    border: 1px solid ${AlertColors[variant].borderColor};
    background: ${AlertColors[variant].backgroundColor};
  `}
  position: relative;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
`;

Alert.defaultProps = {
  mb: '1rem',
};

export default Alert;
