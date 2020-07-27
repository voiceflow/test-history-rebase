import React from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton, { IconButtonVariant } from '@/components/IconButton';

import { Container } from './components';

export type RemoveDropDownProps = {
  onRemove: () => void;
};

const RemoveDropDown: React.FC<RemoveDropDownProps> = ({ onRemove }) => (
  <Container>
    <Dropdown options={[{ label: 'Delete', onClick: onRemove }]}>
      {(ref, onToggle, isOpen) => <IconButton icon="elipsis" variant={IconButtonVariant.FLAT} active={isOpen} onClick={onToggle} ref={ref} />}
    </Dropdown>
  </Container>
);

export default RemoveDropDown;
