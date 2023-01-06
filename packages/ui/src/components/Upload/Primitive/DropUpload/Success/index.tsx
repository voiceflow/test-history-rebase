import React from 'react';

import { CornerActionButton, StatusIcon } from '../styles';

const Success: React.OldFC<{ successLabel?: string; onClose: VoidFunction }> = ({ successLabel = 'Success', onClose }) => (
  <>
    {onClose && <CornerActionButton onClick={onClose} size={12} icon="close" />}
    <StatusIcon color="#279745" icon="checkmark" />
    <span>{successLabel}</span>
  </>
);

export default Success;
