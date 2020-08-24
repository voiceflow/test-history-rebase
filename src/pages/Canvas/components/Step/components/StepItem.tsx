import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { StepLabelVariant } from '@/constants/canvas';
import Port from '@/pages/Canvas/components/Port';
import { PortEntityProvider } from '@/pages/Canvas/contexts';

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
      <IconContainer>{icon && <SvgIcon icon={icon} size={18} color={iconColor} />}</IconContainer>
      <StepLabelTextContainer variant={label ? labelVariant : StepLabelVariant.PLACEHOLDER}>
        <StepLabelText onClick={onClick} multiline={multilineLabel} lineClamp={labelLineClamp}>
          {label || placeholder}
        </StepLabelText>
      </StepLabelTextContainer>
      {stepAPI?.withPorts && portID && (
        <PortEntityProvider id={portID}>
          <Port color={portColor} />
        </PortEntityProvider>
      )}
    </Container>
  );
};
export default Item;
