import React from 'react';

import { CornerActionButton, StatusIcon } from '..';

function Success({ successLabel, onClose }) {
  return (
    <>
      <CornerActionButton onClick={onClose} size={12} icon="close" />
      <StatusIcon color="#279745" icon="checkmark" />
      <span>{successLabel}</span>
    </>
  );
}

export default Success;
