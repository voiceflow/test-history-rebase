import React from 'react';

import Button from '@/components/Button';

export const ModalHeader = ({ header, toggle, children }) => (
  <div className="modal-header">
    <h5 className="modal-title">{header || children}</h5>
    <Button className="close" aria-label="Close" onClick={toggle} />
  </div>
);
