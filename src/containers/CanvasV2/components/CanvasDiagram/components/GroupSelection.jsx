/* eslint-disable compat/compat */
import _ from 'lodash';
import React from 'react';

import { CanvasContext } from '@/components/Canvas/contexts';
import { GroupSelectionContext } from '@/containers/CanvasV2/contexts';
import { useMouseMove } from '@/hooks/mouse';

import SelectionArea from './SelectionArea';

const styleSelectionElement = (selectionEl, left, top, width, height) => {
  selectionEl.style.left = `${left}px`;
  selectionEl.style.top = `${top}px`;
  selectionEl.style.width = `${width}px`;
  selectionEl.style.height = `${height}px`;
  selectionEl.style.display = width === 0 && height === 0 ? 'none' : 'block';
};

const GroupSelection = () => {
  const groupSelection = React.useContext(GroupSelectionContext);
  const selection = React.useRef([0, 0]);
  const canvas = React.useContext(CanvasContext);
  const updateActiveTargets = _.throttle(groupSelection.updateActiveTargets, 100);
  let isSelecting = !!groupSelection.origin;

  React.useEffect(() => {
    if (isSelecting) {
      const clearSelection = () => {
        selection.current = [0, 0];
        groupSelection.onStop();
        isSelecting = false;

        const rootEl = groupSelection.ref.current;

        window.requestAnimationFrame(() => {
          styleSelectionElement(rootEl, 0, 0, 0, 0);
        });
      };
      document.addEventListener('mouseup', clearSelection);

      return () => document.removeEventListener('mouseup', clearSelection);
    }
  }, [isSelecting, groupSelection.onStop]);

  useMouseMove(
    ({ clientX, clientY }) => {
      if (isSelecting) {
        const origin = groupSelection.origin;
        const rootEl = groupSelection.ref.current;

        const nextSelection = [clientX, clientY];
        selection.current = nextSelection;

        window.requestAnimationFrame(() => {
          const [originX, originY] = canvas.transformPoint(origin);
          const [selectX, selectY] = canvas.transformPoint([clientX, clientY]);

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
