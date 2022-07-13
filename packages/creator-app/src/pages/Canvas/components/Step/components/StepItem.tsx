import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Port from '@/pages/Canvas/components/Port';
import { PortEntityProvider } from '@/pages/Canvas/contexts';
import { ClassName } from '@/styles/constants';

import { StepAPIContext } from '../contexts';
import { ItemProps } from '../types';
import NewLineAttachmentContainer from './NewLineAttachmentContainer';
import StepIcon from './StepIcon';
import Container from './StepItemContainer';
import StepLabelText from './StepLabelText';
import StepLabelTextContainer from './StepLabelTextContainer';
import StepLinkedLabelContainer from './StepLinkedLabelContainer';
import StepLinkedLabelIcon from './StepLinkedLabelIcon';
import StepLinkedLabelText from './StepLinkedLabelText';
import StepTitle from './StepTitle';

const StepItem: React.FC<ItemProps> = ({
  children,
  icon,
  iconColor,
  label,
  title,
  portID,
  onClick,
  wordBreak,
  attachment,
  prefix,
  placeholder,
  linkedLabel,
  labelVariant = StepLabelVariant.PRIMARY,
  withNewLines,
  multilineLabel,
  labelLineClamp,
  palette,
  nested,
  textColor,
  iconSize,
  iconStyle,
  nestedWithIcon,
  newLineAttachment,
  v2,
  style,
}) => {
  const stepAPI = React.useContext(StepAPIContext);

  return (
    <>
      <Container className={ClassName.CANVAS_STEP_ITEM} nested={nested} nestedWithIcon={nestedWithIcon} style={style}>
        {children ?? (
          <>
            {prefix}

            {v2 && icon && <StepIcon palette={palette} iconColor={iconColor} icon={icon} iconSize={iconSize} style={iconStyle} />}

            {!v2 && <StepIcon palette={palette} iconColor={iconColor} icon={icon} iconSize={iconSize} style={iconStyle} />}

            <StepLabelTextContainer variant={label ? labelVariant : StepLabelVariant.PLACEHOLDER}>
              {title && (
                <StepTitle
                  onClick={onClick}
                  className={ClassName.CANVAS_STEP_ITEM_LABEL}
                  multiline={multilineLabel}
                  lineClamp={labelLineClamp}
                  withNewLines={withNewLines}
                  wordBreak={wordBreak}
                  color={textColor}
                >
                  {title}
                </StepTitle>
              )}

              <StepLabelText
                onClick={onClick}
                className={ClassName.CANVAS_STEP_ITEM_LABEL}
                multiline={multilineLabel}
                lineClamp={labelLineClamp}
                withNewLines={withNewLines}
                wordBreak={wordBreak}
                color={textColor}
                hasTitle={!!title}
              >
                {label || placeholder}
              </StepLabelText>

              {!!linkedLabel && (
                <StepLinkedLabelContainer>
                  <StepLinkedLabelIcon />
                  <StepLinkedLabelText>{linkedLabel}</StepLinkedLabelText>
                </StepLinkedLabelContainer>
              )}

              {newLineAttachment && <NewLineAttachmentContainer>{newLineAttachment}</NewLineAttachmentContainer>}
            </StepLabelTextContainer>

            {attachment}
          </>
        )}

        {stepAPI?.withPorts && portID && (
          <PortEntityProvider id={portID}>
            <Port />
          </PortEntityProvider>
        )}
      </Container>
    </>
  );
};

export default StepItem;
