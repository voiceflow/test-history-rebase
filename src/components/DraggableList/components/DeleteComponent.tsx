import React from 'react';

import IconButton from '@/components/IconButton';
import { useEnableDisable } from '@/hooks';

import DeleteComponentWrapper from './DeleteComponentWrapper';
import DeleteText from './DeleteText';

export type DeleteComponentProps = {
  message?: React.ReactNode;
};

const DeleteComponent: React.FC<DeleteComponentProps> = ({ message = 'Drop blocks to remove' }, ref: React.Ref<HTMLDivElement>) => {
  const [hover, startHover, stopHover] = useEnableDisable(false);

  return (
    <DeleteComponentWrapper ref={ref} onDragOver={startHover} onDragLeave={stopHover}>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        <IconButton icon={hover ? 'trashOpen' : 'trash'} variant="flat" />
      }
      <DeleteText>{message}</DeleteText>
    </DeleteComponentWrapper>
  );
};

export default React.forwardRef<HTMLDivElement, DeleteComponentProps>(DeleteComponent);
