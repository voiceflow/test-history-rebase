import React from 'react';

import User from '@/components/User';
import { stopPropagation } from '@/utils/dom';

import { Container, Image, ImageContainer } from './components';
import { StepAPIContext } from './contexts';

export * from './components';
export * from './types';

// TODO: remove this once User component is converted into TS
// declaring the type for component otherwise, TS implies its of RefAttribute and gives error that user prop does not exist on the component
const LockOwner: any = User;

export type BaseStepProps = {
  image?: string;
  disableHighlightStyle?: boolean;
};

export type StepProps = BaseStepProps & { children: React.ReactNode | React.ReactNode[] };

const Step: React.FC<StepProps> = ({ image, disableHighlightStyle = false, children }) => {
  const stepAPI = React.useContext(StepAPIContext);

  const el = (
    <Container
      {...stepAPI?.handlers}
      isActive={stepAPI?.isActive && !disableHighlightStyle}
      isHovered={stepAPI?.isHovered}
      hasLinkWarning={stepAPI?.hasLinkWarning}
      onMouseDown={stopPropagation(null, true)}
      ref={stepAPI?.ref}
    >
      {stepAPI?.lockOwner && <LockOwner user={stepAPI.lockOwner} />}
      {children}

      {image && (
        <ImageContainer>
          <Image image={image} />
        </ImageContainer>
      )}
    </Container>
  );

  return stepAPI?.wrapElement(el) ?? el;
};

export default Step;
