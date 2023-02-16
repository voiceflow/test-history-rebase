import React from 'react';

export type Gate = React.ComponentType<React.PropsWithChildren>;

export interface BatchLoadingGateProps extends React.PropsWithChildren {
  gates: Gate[];
}

const BatchLoadingGate: React.FC<BatchLoadingGateProps> = ({ gates, children }) => {
  const [Gate, ...nextGates] = gates;

  return <Gate>{nextGates.length ? <BatchLoadingGate gates={nextGates}>{children}</BatchLoadingGate> : children}</Gate>;
};

export default BatchLoadingGate;
