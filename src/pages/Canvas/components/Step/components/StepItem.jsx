import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { LabelVariant } from '../constants';
import IconContainer from './StepIconContainer';
import Container from './StepItemContainer';
import LabelText from './StepLabelText';
import Port from './StepPort';

const StepItem = ({
  icon,
  iconColor,
  label,
  placeholder,
  labelVariant = LabelVariant.PRIMARY,
  withPort = true,
  portColor,
  isConnected,
  onClickPort,
}) => {
  return (
    <Container>
      <IconContainer>{icon && <SvgIcon icon={icon} color={iconColor} />}</IconContainer>
      <LabelText variant={label ? labelVariant : LabelVariant.PLACEHOLDER}>{label || placeholder}</LabelText>
      {withPort && <Port isConnected={isConnected} onClick={onClickPort} color={portColor} />}
    </Container>
  );
};
export default StepItem;
