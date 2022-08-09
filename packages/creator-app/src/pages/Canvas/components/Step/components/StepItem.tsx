import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { ClassName } from '@/styles/constants';

import { ItemProps } from '../types';
import NewLineAttachmentContainer from './NewLineAttachmentContainer';
import StepIcon from './StepIcon';
import Container from './StepItemContainer';
import StepLabelText from './StepLabelText';
import StepLabelTextContainer from './StepLabelTextContainer';
import StepLinkedLabelContainer from './StepLinkedLabelContainer';
import StepLinkedLabelIcon from './StepLinkedLabelIcon';
import StepLinkedLabelText from './StepLinkedLabelText';
import StepPort from './StepPort';
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
  parentActionsPath,
  parentActionsParams,
}) => (
  <Container className={ClassName.CANVAS_STEP_ITEM} nested={nested} nestedWithIcon={nestedWithIcon}>
    {children ?? (
      <>
        {prefix}

        {v2 && icon && <StepIcon palette={palette} iconColor={iconColor} icon={icon} iconSize={iconSize} style={iconStyle} />}

        {!v2 && <StepIcon palette={palette} iconColor={iconColor} icon={icon} iconSize={iconSize} style={iconStyle} />}

        <StepLabelTextContainer variant={label ? labelVariant : StepLabelVariant.PLACEHOLDER}>
          {title && (
            <StepTitle
              color={textColor}
              onClick={onClick}
              className={ClassName.CANVAS_STEP_ITEM_LABEL}
              multiline={multilineLabel}
              lineClamp={labelLineClamp}
              wordBreak={wordBreak}
              withNewLines={withNewLines}
            >
              {title}
            </StepTitle>
          )}

          <StepLabelText
            color={textColor}
            onClick={onClick}
            hasTitle={!!title}
            multiline={multilineLabel}
            className={ClassName.CANVAS_STEP_ITEM_LABEL}
            lineClamp={labelLineClamp}
            wordBreak={wordBreak}
            withNewLines={withNewLines}
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

    <StepPort portID={portID} parentActionsPath={parentActionsPath} parentActionsParams={parentActionsParams} />
  </Container>
);

export default StepItem;
