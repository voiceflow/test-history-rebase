import React from 'react';

import { PlatformType } from '@/constants';
import { Node, NodeData } from '@/models';
import { stopPropagation } from '@/utils/dom';

import { Container, Image, ImageContainer } from './components';

export * from './components';
export * from './types';

export type BaseStepProps = {
  image?: string;
  isActive?: boolean;
  onClick?: () => void;
};

export type StepProps = BaseStepProps & { children: React.ReactNode | React.ReactNode[] };

export type ConnectedStepProps<T = {}> = {
  stepProps: Pick<BaseStepProps, 'isActive' | 'onClick'> & { withPorts: boolean };
  node: Node;
  data: NodeData<T>;
  platform: PlatformType;
};

const Step: React.FC<StepProps> = ({ isActive, onClick, image, children }) => (
  <Container isActive={isActive} onMouseDown={stopPropagation(null, true)} onClick={onClick}>
    {children}

    {image && (
      <ImageContainer>
        <Image image={image} />
      </ImageContainer>
    )}
  </Container>
);

export default Step;
