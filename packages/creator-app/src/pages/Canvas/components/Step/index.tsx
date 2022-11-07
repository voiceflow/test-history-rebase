import { stopPropagation, User } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { useEditingMode } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';

import {
  ActionPort,
  Attachment,
  Container,
  HoverContainer,
  Icon,
  Image,
  Item,
  LabelText,
  LabelTextContainer,
  Section,
  StepButton,
  StepIconContainer,
  StepItemContainer,
  StepLabelRow,
  StepLabelText,
  StepLabelTextContainer,
  StepPort,
  StepPreviewButton,
  SubItem,
  SubLabelText,
} from './components';
import { StepAPIContext } from './contexts';

export * from './components';
export * from './types';

export interface BaseStepProps {
  nodeID?: string;
  image?: string | null;
  imagePosition?: string;
  imageAspectRatio?: number | null;
  disableHighlightStyle?: boolean;
  dividerOffset?: number;
}

export type StepProps = BaseStepProps;

const Step: React.FC<StepProps> = ({ nodeID, image, disableHighlightStyle, children, imagePosition, imageAspectRatio, dividerOffset }) => {
  const stepAPI = React.useContext(StepAPIContext);
  const isEditingMode = useEditingMode();

  const element = (
    <HoverContainer
      className={ClassName.CANVAS_STEP}
      data-node-id={nodeID}
      {...stepAPI?.handlers}
      ref={stepAPI?.ref}
      onMouseDown={stopPropagation(null, true)}
      readOnlyMode={!isEditingMode}
    >
      <Container canHighlight={!disableHighlightStyle} draggable={stepAPI?.isDraggable} dividerOffset={dividerOffset}>
        {stepAPI?.lockOwner && <User user={stepAPI.lockOwner} />}
        {children}
        {image && <Image position={imagePosition} image={image} aspectRatio={imageAspectRatio} />}
      </Container>
    </HoverContainer>
  );

  return stepAPI?.wrapElement(element) ?? element;
};

export default Object.assign(Step, {
  Icon,
  Image,
  Item,
  ActionPort,
  LabelText,
  LabelTextContainer,
  Section,
  StepLabelVariant,
  SubItem,
  SubLabelText,
  Attachment,
  StepButton,
  StepIconContainer,
  StepPreviewButton,
  StepLabelRow,
  StepItemContainer,
  StepLabelTextContainer,
  StepLabelText,
  StepPort,
  APIContext: StepAPIContext,
});
