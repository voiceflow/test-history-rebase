import React from 'react';

import User from '@/components/User';
import { PlatformType } from '@/constants';
import { LockOwnerType, Node, NodeData } from '@/models';
import { stopPropagation } from '@/utils/dom';

import { Container, Image, ImageContainer } from './components';

export * from './components';
export * from './types';

// TODO: remove this once User component is converted into TS
// declaring the type for component otherwise, TS implies its of RefAttribute and gives error that user prop does not exist on the component
const LockOwner: any = User;

export type BaseStepProps = {
  image?: string;
  isActive?: boolean;
  onClick?: () => void;
  lockOwner?: LockOwnerType;
};

export type StepProps = BaseStepProps & { children: React.ReactNode | React.ReactNode[] };

export type ConnectedStepProps<T = {}> = {
  stepProps: Pick<BaseStepProps, 'isActive' | 'onClick' | 'lockOwner'> & { withPorts: boolean };
  node: Node;
  data: NodeData<T>;
  platform: PlatformType;
};

const Step: React.FC<StepProps> = ({ isActive, onClick, image, lockOwner, children }) => (
  <Container isActive={isActive} onMouseDown={stopPropagation(null, true)} onClick={onClick}>
    {lockOwner && <LockOwner user={lockOwner} />}
    {children}

    {image && (
      <ImageContainer>
        <Image image={image} />
      </ImageContainer>
    )}
  </Container>
);

export default Step;
