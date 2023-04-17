/* eslint-disable no-param-reassign */
import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';

import { OverlayState } from '../../types';

const useRotate = ({ snapshot, rotation }: OverlayState) => {
  const engine = React.useContext(EngineContext)!;

  const handleRotate = React.useCallback(() => {
    if (!snapshot.current || !engine.mousePosition.current) return;

    const transform = snapshot.current;
    const centerY = transform.rect.top + transform.rect.height / 2;
    const centerX = transform.rect.left + transform.rect.width / 2;

    const rotate = Math.atan2(engine.mousePosition.current[1] - centerY, engine.mousePosition.current[0] - centerX) + Math.PI / 2;

    rotation.current = rotate;

    engine.transformation.rotateTarget(rotate);
  }, []);

  return React.useCallback(() => {
    engine.transformation.start();
    document.addEventListener(
      'mouseup',
      () => {
        engine.transformation.complete();
        document.removeEventListener('mousemove', handleRotate);
      },
      { once: true }
    );
    document.addEventListener('mousemove', handleRotate, false);
  }, []);
};

export default useRotate;
