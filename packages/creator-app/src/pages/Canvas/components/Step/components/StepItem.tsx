import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Port from '@/pages/Canvas/components/Port';
import { PortEntityProvider } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import { StepAPIContext } from '../contexts';
import { ItemProps } from '../types';
import IconContainer from './StepIconContainer';
import Container from './StepItemContainer';
import StepLabelText from './StepLabelText';
import StepLabelTextContainer from './StepLabelTextContainer';
import StepLinkedLabelContainer from './StepLinkedLabelContainer';
import StepLinkedLabelIcon from './StepLinkedLabelIcon';
import StepLinkedLabelText from './StepLinkedLabelText';

const Item: React.FC<ItemProps> = ({
  icon,
  label,
  portID,
  onClick,
  iconColor,
  portColor,
  wordBreak,
  attachment,
  placeholder,
  linkedLabel,
  labelVariant = StepLabelVariant.PRIMARY,
  withNewLines,
  multilineLabel,
  labelLineClamp,
}) => {
  const stepAPI = React.useContext(StepAPIContext);

  return (
    <Container className={ClassName.CANVAS_STEP_ITEM}>
      <IconContainer>{icon && <SvgIcon icon={icon} size={18} color={iconColor} />}</IconContainer>

      <StepLabelTextContainer variant={label ? labelVariant : StepLabelVariant.PLACEHOLDER}>
        <StepLabelText
          onClick={onClick}
          className={ClassName.CANVAS_STEP_ITEM_LABEL}
          multiline={multilineLabel}
          lineClamp={labelLineClamp}
          withNewLines={withNewLines}
          wordBreak={wordBreak}
        >
          {label || placeholder}
        </StepLabelText>

        {!!linkedLabel && (
          <StepLinkedLabelContainer>
            <StepLinkedLabelIcon />
            <StepLinkedLabelText>{linkedLabel}</StepLinkedLabelText>
          </StepLinkedLabelContainer>
        )}
      </StepLabelTextContainer>

      {attachment}

      {stepAPI?.withPorts && portID && (
        <PortEntityProvider id={portID}>
          <Port color={portColor} />
        </PortEntityProvider>
      )}
    </Container>
  );
};
export default Item;
