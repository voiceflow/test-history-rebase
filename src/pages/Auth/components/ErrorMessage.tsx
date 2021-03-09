import React from 'react';

const ErrorMessage: React.FC = ({ children }) => (
  <div className="errorContainer row">
    <div className="col-1">
      <img src="/error.svg" alt="" />
    </div>
    <div className="col-11">{children}</div>
  </div>
);

export default ErrorMessage;
