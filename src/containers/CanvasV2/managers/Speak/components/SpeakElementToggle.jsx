import cn from 'classnames';
import React from 'react';

import Container from './SpeakElementToggleContainer';

const SpeakElementToggle = ({ randomize, isOpen, index, onClick }) => (
  <Container onClick={onClick}>
    <i className={cn('fas', `fa-caret-${isOpen ? 'down' : 'right'}`)} />
    {randomize ? <i className="far fa-random" /> : index + 1}
  </Container>
);

export default SpeakElementToggle;
