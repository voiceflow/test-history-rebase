import Button from 'components/Button';
import React from 'react';

export const ModalHeader = ({ header, toggle }) => (
  <div className="modal-header">
    <h5 className="modal-title">{header}</h5>
    <Button className="close" aria-label="Close" onClick={toggle} />
  </div>
);
