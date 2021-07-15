import { Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';

import { Container } from './components';

const Label = (label: string) => {
  return <Checkbox checked={true}>{label}</Checkbox>;
};
const DialogHeader = () => {
  return (
    <Container>
      <b>Transcript</b>
      <Dropdown
        options={[
          {
            label: Label('Intent confidence'),
            onClick: () => alert('Intent confidence clicked'),
          },
          {
            label: Label('Debug messages'),
            onClick: () => alert('Debug messages clicked'),
          },
        ]}
        placement="bottom-end"
      >
        {(ref, onToggle, isOpen) => (
          <IconButton icon="ellipsis" variant={IconButtonVariant.FLAT} active={isOpen} size={15} onClick={onToggle} ref={ref} large />
        )}
      </Dropdown>
    </Container>
  );
};
export default DialogHeader;
