import { FullSpinner, FullSpinnerProps, Spinner, SpinnerProps } from '@voiceflow/ui';
import React from 'react';

import { DEBUG_LOADING_GATES } from '@/config';
import logger from '@/utils/logger';

const log = logger.child('LoadingGate');

export interface LoadingGateProps extends React.PropsWithChildren {
  full?: boolean;
  load?: null | (() => void);
  label?: string;
  zIndex?: number | string;
  unload?: () => void;
  isLoaded: boolean;
  hasLabel?: boolean;
  component?: React.FC<FullSpinnerProps | SpinnerProps>;
  borderless?: boolean;
  internalName: string;
  fillContainer?: boolean;
  withoutSpinner?: boolean;
  backgroundColor?: string;
}

const LoadingGate: React.FC<LoadingGateProps> = ({
  full = true,
  load,
  label,
  unload,
  zIndex,
  hasLabel = true,
  children,
  isLoaded,
  component,
  borderless,
  internalName,
  fillContainer = false,
  withoutSpinner,
  backgroundColor,
}) => {
  React.useEffect(() => {
    if (isLoaded) {
      return unload;
    }

    if (DEBUG_LOADING_GATES) {
      log.info('loading', log.bold(internalName));
    }

    load?.();

    return undefined;
  }, [isLoaded]);

  if (!isLoaded) {
    const SpinnerComponent = component ?? (full ? FullSpinner : Spinner);

    return withoutSpinner ? null : (
      <SpinnerComponent
        name={hasLabel ? label || 'Data' : ''}
        zIndex={zIndex}
        borderLess={borderless}
        fillContainer={fillContainer}
        backgroundColor={backgroundColor}
      />
    );
  }

  return <>{children}</>;
};

export default LoadingGate;
