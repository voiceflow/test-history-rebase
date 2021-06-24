import { IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { useEnableDisable } from '@/hooks';

import DeleteComponentContent from './DeleteComponentContent';
import DeleteComponentWrapper from './DeleteComponentWrapper';
import DeleteText from './DeleteText';

export type DeleteComponentProps = {
  message?: React.ReactNode;
};

const DeleteComponent: React.ForwardRefRenderFunction<HTMLDivElement, DeleteComponentProps> = ({ message = 'Drop here to remove' }, ref) => {
  const [hover, startHover, stopHover] = useEnableDisable(false);

  return (
    <DeleteComponentWrapper>
      <DeleteComponentContent ref={ref} onDragOver={startHover} onDragLeave={stopHover}>
        <IconButton icon={hover ? 'trashOpen' : 'trash'} variant={IconButtonVariant.FLAT} />
        <DeleteText>{message}</DeleteText>
      </DeleteComponentContent>
    </DeleteComponentWrapper>
  );
};

export default React.forwardRef<HTMLDivElement, DeleteComponentProps>(DeleteComponent);
