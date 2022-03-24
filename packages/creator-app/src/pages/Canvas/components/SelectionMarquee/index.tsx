import { useMouseMove } from '@voiceflow/ui';
import React from 'react';

import { useRAF, useRegistration } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { Point } from '@/types';

import SelectionArea from './components/SelectionArea';
import { styleSelectionElement } from './constants';
import { useSelectionMarqueeAPI } from './hooks';

const SelectionMarquee: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const api = useSelectionMarqueeAPI();
  const [stylesScheduler] = useRAF();

  useMouseMove(({ clientX, clientY }) => {
    if (engine.groupSelection.isDrawing) {
      const nextSelection: Point = [clientX, clientY];

      engine.groupSelection.updateCandidates(nextSelection);

      stylesScheduler(() => {
        const origin = engine.groupSelection.mouseOrigin;
        const rootEl = api.ref.current;

        if (!origin || !rootEl) {
          return;
        }

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

  return <SelectionArea ref={api.ref} />;
};

export default SelectionMarquee;
