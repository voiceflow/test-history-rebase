import React from 'react';
import { Tooltip } from 'react-tippy';

import BaseCheckbox from '@/components/Checkbox';

import Container from './BookDemoContainer';

// TODO: remove this once BaseCheckbox component is converted into TS file
const Checkbox: any = BaseCheckbox;

export type BookDemoProps = {
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
};

const BookDemo: React.FC<BookDemoProps> = ({ checked, onChange, disabled }) => {
  const checkbox = (
    <Checkbox checked={checked} onChange={onChange} disabled={disabled}>
      <span>I'd like to book an onboarding demo with my team</span>
    </Checkbox>
  );
  return (
    <Container disabled={disabled}>
      {disabled ? <Tooltip title="You need to invite teammates to book a team onboarding">{checkbox}</Tooltip> : checkbox}
    </Container>
  );
};

export default BookDemo;
