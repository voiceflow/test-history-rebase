import React from 'react';

import { ROOT_NODES } from '@/constants';
import { withContext } from '@/hocs';
import { Point } from '@/types';

import { EngineContext } from './EngineContext';

export type GroupSelectionValue = {
  ref: React.RefObject<HTMLDivElement>;
  origin: Point | null;
  onStart: (origin: Point) => void;
  onStop: () => void;
  updateActiveTargets: (mousePosition: Point) => void;
};

export const GroupSelectionContext = React.createContext<GroupSelectionValue | null>(null);
export const { Consumer: GroupSelectionConsumer } = GroupSelectionContext;

export const GroupSelectionProvider: React.FC = ({ children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const engine = React.useContext(EngineContext)!;
  const [origin, setOrigin] = React.useState<Point | null>(null);
  const onStart = (nextOrigin: Point) => {
    engine.clearActivation();
    setOrigin(nextOrigin);
  };

  const onStop = () => setOrigin(null);

  const updateActiveTargets = ([clientX, clientY]: Point) => {
    const left = Math.min(clientX, origin![0]);
    const top = Math.min(clientY, origin![1]);
    const width = Math.abs(clientX - origin![0]);
    const height = Math.abs(clientY - origin![1]);
    const right = left + width;
    const bottom = top + height;

    const nextTargets = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, node] of engine.nodes.entries()) {
      // eslint-disable-next-line no-continue
      if (!ROOT_NODES.includes(node.api.nodeType)) continue;

      const rect = node.api.instance!.getRect();

      // eslint-disable-next-line no-continue
      if (!rect) continue;

      const [x, y] = [rect.left + rect.width / 2, rect.top + rect.height / 2];

      if (x >= left && x <= right && top <= y && bottom >= y) {
        nextTargets.push(key);
      }
    }

    engine.selection.replace(nextTargets);
  };

  return <GroupSelectionContext.Provider value={{ ref, origin, onStart, onStop, updateActiveTargets }}>{children}</GroupSelectionContext.Provider>;
};

export const withGroupSelection = withContext(GroupSelectionContext, 'groupSelection');
