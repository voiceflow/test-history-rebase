import { Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { Container } from './components';

export interface RemoveDropDownProps {
  onRemove: () => void;
  deleteText?: string;
}

const RemoveDropDown: React.OldFC<RemoveDropDownProps> = ({ onRemove, deleteText = 'Delete' }) => (
  <Container>
    <Dropdown options={[{ label: deleteText, onClick: onRemove }]}>
      {(ref, onToggle, isOpen) => <IconButton icon="ellipsis" variant={IconButtonVariant.FLAT} active={isOpen} onClick={onToggle} ref={ref} />}
    </Dropdown>
  </Container>
);

export default RemoveDropDown;
