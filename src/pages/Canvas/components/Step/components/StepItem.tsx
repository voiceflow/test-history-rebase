import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';
import { StepLabelVariant } from '@/constants/canvas';

import IconContainer from './StepIconContainer';
import Container from './StepItemContainer';
import LabelText from './StepLabelText';
import Port from './StepPort';

export type StepItemProps = {
  icon?: Icon;
  label?: string;
  onClick?: React.ReactEventHandler;
  withPort?: boolean;
  iconColor?: string;
  portColor?: string;
  placeholder?: string;
  isConnected?: boolean;
  onClickPort?: React.ReactEventHandler;
  labelVariant?: StepLabelVariant;
  multilineLabel?: boolean;
  labelLineClamp?: number;
};

const Item: React.FC<StepItemProps> = ({
  icon,
  label,
  onClick,
  withPort = true,
  iconColor,
  portColor,
  placeholder,
  isConnected,
  onClickPort,
  labelVariant = StepLabelVariant.PRIMARY,
  multilineLabel,
  labelLineClamp,
}) => {
  return (
    <Container>
      <IconContainer>{icon && <SvgIcon icon={icon} size={16} color={iconColor} />}</IconContainer>

      <LabelText
        onClick={onClick}
        variant={label ? labelVariant : StepLabelVariant.PLACEHOLDER}
        multiline={multilineLabel}
        lineClamp={labelLineClamp}
      >
        {label || placeholder}
      </LabelText>

      {withPort && <Port isConnected={isConnected} onClick={onClickPort} color={portColor} />}
    </Container>
  );
};
export default Item;
