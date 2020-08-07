import React from 'react';

import { useMouseMove, useRegistration } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Point } from '@/types';

import SelectionArea from './components/SelectionArea';
import { styleSelectionElement } from './constants';
import { useSelectionMarqueeAPI } from './hooks';

const SelectionMarquee: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const engine = React.useContext(EngineContext)!;
  const api = useSelectionMarqueeAPI();

  useMouseMove(({ clientX, clientY }) => {
    if (engine.groupSelection.isDrawing) {
      const origin = engine.groupSelection.mouseOrigin!;
      const rootEl = ref.current!;

      const nextSelection: Point = [clientX, clientY];

      engine.groupSelection.updateCandidates(nextSelection);
      window.requestAnimationFrame(() => {
        const [originX, originY] = engine.canvas!.transformPoint(origin);
        const [selectX, selectY] = engine.canvas!.transformPoint([clientX, clientY]);

        styleSelectionElement(
          rootEl,
          Math.min(originX, selectX),
          Math.min(originY, selectY),
          Math.abs(originX - selectX),
          Math.abs(originY - selectY)
        );
      });
    }
  }, []);

  useRegistration(() => engine.groupSelection.register('selectionMarquee', api), [api]);

  return <SelectionArea ref={ref} />;
};

export default SelectionMarquee;
