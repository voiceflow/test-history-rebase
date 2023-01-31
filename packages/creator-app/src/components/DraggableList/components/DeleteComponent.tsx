import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import DeleteComponentContent from './DeleteComponentContent';
import DeleteComponentWrapper from './DeleteComponentWrapper';
import DeleteText from './DeleteText';

export interface DeleteComponentProps {
  message?: React.ReactNode;
}

const DeleteComponent = React.forwardRef<HTMLDivElement, DeleteComponentProps>(({ message = 'Drop here to remove' }, ref) => (
  <DeleteComponentWrapper>
    <DeleteComponentContent ref={ref}>
      <SvgIcon icon="trash" />
      <DeleteText>{message}</DeleteText>
    </DeleteComponentContent>
  </DeleteComponentWrapper>
));

export default DeleteComponent;
