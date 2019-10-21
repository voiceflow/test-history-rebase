import React from 'react';

const BaseOption = ({ label, children }) => (
  <div className="d-flex slot-label justify-content-between">
    <span className="mr-2">{label}</span>
    <span className="d-flex">{children}</span>
  </div>
);

export default BaseOption;
