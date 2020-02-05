import React from 'react';
import { Alert } from 'reactstrap';

import { FlexCenter } from '@/componentsV2/Flex';

import { AlertIcon } from './components';

export const ALERT_MESSAGE_VARIANTS = {
  primary: {
    name: 'primary',
    icon: '',
  },
  success: {
    name: 'success',
    icon: 'check',
  },
  danger: {
    name: 'danger',
    icon: '',
  },
  warning: {
    name: 'warning',
    icon: 'warning',
  },
};

function AlertMessage({ variant = 'primary', textAlign = 'center', message, icon, iconProps = {}, className }) {
  const color = ALERT_MESSAGE_VARIANTS[variant].name;
  return (
    <Alert color={color} style={{ textAlign }} className={className}>
      <FlexCenter>{icon ? <AlertIcon icon={icon} {...iconProps} /> : <AlertIcon icon={ALERT_MESSAGE_VARIANTS[variant].icon} />}</FlexCenter>
      {message}
    </Alert>
  );
}

export default AlertMessage;
