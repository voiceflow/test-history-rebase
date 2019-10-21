import React from 'react';
import { Tooltip } from 'react-tippy';

const Validation = ({ validate, component: Component, onChange, onBlur, ...props }) => {
  const [error, setError] = React.useState(null);

  const validateChange = (text) => {
    setError(validate?.(text) || null);
    onChange(text);
  };

  const blurReset = (e) => {
    setError(null);
    onBlur?.(e);
  };

  return (
    <Tooltip theme="warning" arrow position="bottom-start" open={!!error} distance={5} html={error}>
      <Component {...props} onChange={validateChange} onBlur={blurReset} />
    </Tooltip>
  );
};

export default Validation;
