import React from 'react';

import { FullSpinner, Spinner } from '@/components/Spinner';

function LoadingGate({ label, isLoaded, load, unload, full = true, children, zIndex, backgroundColor }) {
  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (isLoaded) {
      return unload;
    }

    load();
  }, [isLoaded]);

  if (!isLoaded) {
    const SpinnerComponent = full ? FullSpinner : Spinner;
    return <SpinnerComponent name={label || 'Data'} zIndex={zIndex} backgroundColor={backgroundColor} />;
  }

  // eslint-disable-next-line lodash/prefer-lodash-typecheck
  return typeof children === 'function' ? children() : children;
}

export default LoadingGate;
