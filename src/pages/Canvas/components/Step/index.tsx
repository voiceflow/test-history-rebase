import React from 'react';

import User from '@/components/User';
import { useEditingMode } from '@/pages/Skill/hooks';
import { ClassName } from '@/styles/constants';
import { stopPropagation } from '@/utils/dom';

import { Container, HoverContainer, Image, ImageContainer } from './components';
import { StepAPIContext } from './contexts';

export * from './components';
export * from './types';

export type BaseStepProps = {
  nodeID?: string;
  image?: string | null;
  imagePosition?: string;
  imageAspectRatio?: number | null;
  disableHighlightStyle?: boolean;
};

export type StepProps = BaseStepProps;

const Step: React.FC<StepProps> = ({ nodeID, image, disableHighlightStyle, children, imagePosition, imageAspectRatio }) => {
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
      <Container canHighlight={!disableHighlightStyle} draggable={stepAPI?.isDraggable}>
        {stepAPI?.lockOwner && <User user={stepAPI.lockOwner} />}
        {children}
        {image && (
          <ImageContainer aspectRatio={imageAspectRatio}>
            <Image position={imagePosition} image={image} />
          </ImageContainer>
        )}
      </Container>
    </HoverContainer>
  );

  return stepAPI?.wrapElement(element) ?? element;
};

export default Step;
