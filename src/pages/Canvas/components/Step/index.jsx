import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, IconContainer, LabelText, Port } from './components';
import { LabelVariant } from './constants';

const Step = ({ icon, iconColor, label, placeholder, labelVariant = LabelVariant.PRIMARY, withPort = true, isActive, isConnected, onClickPort }) => {
  return (
    <Container isActive={isActive}>
      <IconContainer>{icon && <SvgIcon icon={icon} color={iconColor} />}</IconContainer>
      <LabelText variant={label ? labelVariant : LabelVariant.PLACEHOLDER}>{label || placeholder}</LabelText>
      {withPort && <Port isConnected={isConnected} onClick={onClickPort} />}
    </Container>
  );
};
export default Step;
