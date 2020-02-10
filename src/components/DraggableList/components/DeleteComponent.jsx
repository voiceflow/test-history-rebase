import React from 'react';

import { flexApartStyles } from '@/components/Flex';
import IconButton from '@/components/IconButton';
import { styled } from '@/hocs';
import { useEnableDisable } from '@/hooks';

const DeleteComponentWrapper = styled.div.attrs({ column: true })`
  position: sticky;
  bottom: 0;
  ${flexApartStyles}
  width: 100%;
  height: 90px;
  background: #ffffff;
  padding-top: 16px;
  padding-bottom: 8px;
`;

const Text = styled.div`
  width: 100%;
  text-align: center;
  color: #8da2b5;
  pointer-events: none;
  padding: 10px 0;
`;

function DeleteComponent({ message = 'Drop blocks to remove' }, ref) {
  const [hover, startHover, stopHover] = useEnableDisable(false);
  return (
    <DeleteComponentWrapper ref={ref} onDragOver={startHover} onDragLeave={stopHover}>
      <IconButton flat icon={hover ? 'trashOpen' : 'trash'} />
      <Text>{message}</Text>
    </DeleteComponentWrapper>
  );
}

export default React.forwardRef(DeleteComponent);
