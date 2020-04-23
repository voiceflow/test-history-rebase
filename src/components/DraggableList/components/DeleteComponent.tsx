import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { useEnableDisable } from '@/hooks';

import DeleteComponentWrapper from './DeleteComponentWrapper';
import DeleteText from './DeleteText';

export type DeleteComponentProps = {
  message?: React.ReactNode;
};

const DeleteComponent: React.FC<DeleteComponentProps> = ({ message = 'Drop here to remove' }, ref: React.Ref<HTMLDivElement>) => {
  const [hover, startHover, stopHover] = useEnableDisable(false);

  return (
    <DeleteComponentWrapper ref={ref} onDragOver={startHover} onDragLeave={stopHover}>
      <IconButton icon={hover ? 'trashOpen' : 'trash'} variant={IconButtonVariant.FLAT} />
      <DeleteText>{message}</DeleteText>
    </DeleteComponentWrapper>
  );
};

export default React.forwardRef<HTMLDivElement, DeleteComponentProps>(DeleteComponent);
