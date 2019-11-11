import _noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React from 'react';

function BatchLoadingGate({ gates, children, ...componentProps }) {
  const [currentGate, ...nextGates] = gates;

  const [Gate, propsExtractor] = Array.isArray(currentGate) ? currentGate : [currentGate, _noop];

  const gateProps = { ...componentProps, ...propsExtractor(componentProps) };

  return (
    <Gate {...gateProps}>
      {() =>
        nextGates.length ? (
          <BatchLoadingGate {...gateProps} gates={nextGates}>
            {children}
          </BatchLoadingGate>
        ) : (
          children(gateProps)
        )
      }
    </Gate>
  );
}

BatchLoadingGate.propTypes = {
  gates: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.elementType, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]))])
  ).isRequired,
  children: PropTypes.func.isRequired,
};

export default BatchLoadingGate;
