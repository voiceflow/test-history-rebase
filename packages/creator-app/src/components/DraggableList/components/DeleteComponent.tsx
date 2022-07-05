import { IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import DeleteComponentContent from './DeleteComponentContent';
import DeleteComponentWrapper from './DeleteComponentWrapper';
import DeleteText from './DeleteText';

export interface DeleteComponentProps {
  message?: React.ReactNode;
}

const DeleteComponent: React.ForwardRefRenderFunction<HTMLDivElement, DeleteComponentProps> = ({ message = 'Drop here to remove' }, ref) => {
  return (
    <DeleteComponentWrapper>
      <DeleteComponentContent ref={ref}>
        <IconButton icon="trash" variant={IconButtonVariant.FLAT} />
        <DeleteText>{message}</DeleteText>
      </DeleteComponentContent>
    </DeleteComponentWrapper>
  );
};

export default React.forwardRef<HTMLDivElement, DeleteComponentProps>(DeleteComponent);
