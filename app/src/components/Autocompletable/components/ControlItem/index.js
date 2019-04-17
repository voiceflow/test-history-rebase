import React from 'react';
import PropTypes from 'prop-types';

export default function ControlItem({ label, value }) {
  if (!label) {
    return value;
  }

  return (
    <div className="form-control-item">
      <div className="form-control-item__label">{label}</div>
      <div className="form-control-item__value">{value}</div>
    </div>
  );
}

ControlItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};
