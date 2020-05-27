import React from 'react';

import * as User from '@/ducks/user';
import { connect } from '@/hocs';
import { ConnectedProps, MergeArguments } from '@/types';

import CanvasWarningContainer from './CanvasWarningContainer';

const WARNING_DURATION = 5000;

export type CanvasWarningProps = {
  index: number;
  error: User.ErrorMessage;
};

const CanvasWarning: React.FC<CanvasWarningProps & ConnectedCanvasWarningProps> = ({ error, closeCanvasError }) => {
  React.useEffect(() => {
    const timeout = setTimeout(closeCanvasError, WARNING_DURATION);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <CanvasWarningContainer>
      <img className="mr-3" src={error.icon} alt="error" />
      <div className="text-muted text-left w-100">{`${error.msg}`}</div>
      <div className="close pl-1" onClick={closeCanvasError} />
    </CanvasWarningContainer>
  );
};

const mapDispatchToProps = {
  closeCanvasError: User.closeCanvasError,
};

const mergeProps = (...[, { closeCanvasError }, { index }]: MergeArguments<{}, typeof mapDispatchToProps, CanvasWarningProps>) => ({
  closeCanvasError: () => closeCanvasError(index),
});

type ConnectedCanvasWarningProps = ConnectedProps<{}, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(null, mapDispatchToProps, mergeProps)(CanvasWarning) as React.FC<CanvasWarningProps>;
