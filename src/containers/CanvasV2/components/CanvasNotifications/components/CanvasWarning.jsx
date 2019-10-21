import React from 'react';

import { closeCanvasError } from '@/ducks/user';
import { connect } from '@/hocs';

import CanvasWarningContainer from './CanvasWarningContainer';

const WARNING_DURATION = 5000;

function CanvasWarning({ error, closeCanvasError }) {
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
}

const mapDispatchToProps = {
  closeCanvasError,
};

const mergeProps = (_, { closeCanvasError }, { index }) => ({
  closeCanvasError: () => closeCanvasError(index),
});

export default connect(
  null,
  mapDispatchToProps,
  mergeProps
)(CanvasWarning);
