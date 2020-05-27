import _ from 'lodash';
import React from 'react';

import { useMouseMove } from '@/hooks';
import { EngineContext, GroupSelectionContext } from '@/pages/Canvas/contexts';
import { Point } from '@/types';

import SelectionArea from './components/SelectionArea';

const styleSelectionElement = (selectionEl: HTMLElement, left: number, top: number, width: number, height: number) => {
  selectionEl.style.left = `${left}px`;
  selectionEl.style.top = `${top}px`;
  selectionEl.style.width = `${width}px`;
  selectionEl.style.height = `${height}px`;
  selectionEl.style.display = width === 0 && height === 0 ? 'none' : 'block';
};

const GroupSelection: React.FC = () => {
  const groupSelection = React.useContext(GroupSelectionContext)!;
  const engine = React.useContext(EngineContext)!;
  const updateActiveTargets = _.throttle(groupSelection.updateActiveTargets, 100);
  let isSelecting = !!groupSelection.origin;

  React.useEffect(() => {
    if (isSelecting) {
      const clearSelection = () => {
        groupSelection.onStop();
        isSelecting = false;

        const rootEl = groupSelection.ref.current!;

        window.requestAnimationFrame(() => {
          styleSelectionElement(rootEl, 0, 0, 0, 0);
        });
      };
      document.addEventListener('mouseup', clearSelection);

      return () => document.removeEventListener('mouseup', clearSelection);
    }

    return undefined;
  }, [isSelecting, groupSelection.onStop]);

  useMouseMove(
    ({ clientX, clientY }) => {
      if (isSelecting) {
        const origin = groupSelection.origin!;
        const rootEl = groupSelection.ref.current!;

        const nextSelection: Point = [clientX, clientY];

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

        updateActiveTargets(nextSelection);
      }
    },
    [isSelecting]
  );

  return <SelectionArea ref={groupSelection.ref} />;
};

export default GroupSelection;
