import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { StepLabelVariant } from '@/constants/canvas';
import PortV2 from '@/pages/Canvas/components/PortV2';
import { PortIDProvider } from '@/pages/Canvas/contexts';

import { StepAPIContext } from '../contexts';
import { ItemProps } from '../types';
import IconContainer from './StepIconContainer';
import Container from './StepItemContainer';
import StepLabelText from './StepLabelText';
import StepLabelTextContainer from './StepLabelTextContainer';

const Item: React.FC<ItemProps> = ({
  icon,
  label,
  onClick,
  portID,
  iconColor,
  portColor,
  placeholder,
  labelVariant = StepLabelVariant.PRIMARY,
  multilineLabel,
  labelLineClamp,
}) => {
  const stepAPI = React.useContext(StepAPIContext);

  return (
    <Container>
      <IconContainer>{icon && <SvgIcon icon={icon} size={16} color={iconColor} />}</IconContainer>
      <StepLabelTextContainer variant={label ? labelVariant : StepLabelVariant.PLACEHOLDER} multiline={multilineLabel} lineClamp={labelLineClamp}>
        <StepLabelText onClick={onClick}>{label || placeholder}</StepLabelText>
      </StepLabelTextContainer>
      {stepAPI?.withPorts && portID && (
        <PortIDProvider value={portID}>
          <PortV2 color={portColor} />
        </PortIDProvider>
      )}
    </Container>
  );
};
export default Item;
