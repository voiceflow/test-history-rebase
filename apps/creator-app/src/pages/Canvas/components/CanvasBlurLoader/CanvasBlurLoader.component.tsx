import { LoadingSpinner, Tokens } from '@voiceflow/ui-next';
import React from 'react';
import { Transition } from 'react-transition-group';

import { container } from './CanvasBlurLoader.css';

interface ICanvasBlurLoader {
  shown: boolean;
}

export const CanvasBlurLoader: React.FC<ICanvasBlurLoader> = ({ shown }) => {
  return (
    <Transition in={shown} timeout={parseInt(Tokens.animation.duration.default, 10)} mountOnEnter unmountOnExit>
      {(status) => (
        <div className={container({ status })}>
          <LoadingSpinner size="large" variant="dark" />
        </div>
      )}
    </Transition>
  );
};
