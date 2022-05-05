import React from 'react';

import * as Creator from '@/ducks/creator';
import { useDispatch } from '@/hooks';
import { usePrototypingMode } from '@/pages/Project/hooks';
import PrototypeSidebar from '@/pages/Prototype/components/PrototypeSidebar';

const PrototypeOverlay: React.FC = () => {
  const isPrototypingMode = usePrototypingMode();

  const hideCanvas = useDispatch(Creator.hideCanvas);
  const showCanvas = useDispatch(Creator.showCanvas);

  const isCanvasVisible = !isPrototypingMode;

  React.useEffect(() => {
    if (isCanvasVisible) return undefined;

    hideCanvas();

    return () => {
      showCanvas();
    };
  }, [isCanvasVisible]);

  return !isPrototypingMode ? null : (
    <>
      <PrototypeSidebar open />
    </>
  );
};

export default PrototypeOverlay;
