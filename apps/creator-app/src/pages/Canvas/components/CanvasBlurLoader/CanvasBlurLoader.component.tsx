import { LoadingSpinner } from '@voiceflow/ui-next';
import React from 'react';

import { container } from './CanvasBlurLoader.css';

interface ICanvasBlurLoader {
  shown: boolean;
}

export const CanvasBlurLoader: React.FC<ICanvasBlurLoader> = ({ shown }) => (
  <div className={container({ shown })}>
    <LoadingSpinner size="large" variant="dark" />
  </div>
);
