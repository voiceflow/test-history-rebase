import { css, styled } from '@ui/styles';
import { StringifyEnum } from '@voiceflow/common';

import { COLOR_BLUE } from '../../styles/constants';
import Box from '../Box';

export enum AlertVariant {
  DEFAULT = 'default',
  DANGER = 'danger',
  WARNING = 'warning',
  UNSTYLED = 'unstyled',
}

interface AlertStyle {
  color: string;
  borderColor: string;
  backgroundColor: string;
}

const COLORS: Partial<Record<AlertVariant, AlertStyle>> = {
  [AlertVariant.DEFAULT]: { color: COLOR_BLUE, borderColor: '#5d9df515', backgroundColor: '#5d9df515' },
  [AlertVariant.DANGER]: { color: '#721c24', borderColor: '#f8d7da', backgroundColor: '#f8d7da' },
  [AlertVariant.WARNING]: { color: '#856404', borderColor: '#ffeeba', backgroundColor: '#fff3cd' },
};

interface AlertProps {
  variant?: StringifyEnum<AlertVariant>;
}

const Alert = styled(Box)<AlertProps>`
  ${({ variant = AlertVariant.DEFAULT }) => {
    const variantStyle = COLORS[variant];

    return (
      variantStyle &&
      css`
        color: ${variantStyle.color};
        background: ${variantStyle.backgroundColor};
        border: 1px solid ${variantStyle.borderColor};
      `
    );
  }}
  position: relative;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
`;

Alert.defaultProps = {
  mb: '1rem',
};

export default Alert;
