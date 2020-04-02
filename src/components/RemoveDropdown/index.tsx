import React from 'react';

import Dropdown from '@/components/Dropdown';
import IconButton from '@/components/IconButton';

import { Container } from './components';

export type RemoveDropDownProps = {
  onRemove: () => void;
};

const RemoveDropDown: React.FC<RemoveDropDownProps> = ({ onRemove }) => (
  <Container>
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      <Dropdown options={[{ label: 'Delete', onClick: onRemove }]}>
        {(ref: React.Ref<HTMLButtonElement>, onToggle: Function, isOpen: boolean) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          <IconButton icon="elipsis" variant="flat" active={isOpen} onClick={onToggle} ref={ref} />
        )}
      </Dropdown>
    }
  </Container>
);

export default RemoveDropDown;
