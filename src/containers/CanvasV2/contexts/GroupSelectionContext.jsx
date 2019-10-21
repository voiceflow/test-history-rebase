import React from 'react';

import { withContext } from '@/hocs';

import { EngineContext } from './EngineContext';

export const GroupSelectionContext = React.createContext(null);
export const { Consumer: GroupSelectionConsumer } = GroupSelectionContext;

export const GroupSelectionProvider = ({ children }) => {
  const ref = React.useRef();
  const engine = React.useContext(EngineContext);
  const [origin, setOrigin] = React.useState(null);
  const onStart = (nextOrigin) => {
    engine.clearActivation();
    setOrigin(nextOrigin);
  };

  const onStop = () => setOrigin(null);

  const updateActiveTargets = ([clientX, clientY]) => {
    const left = Math.min(clientX, origin[0]);
    const top = Math.min(clientY, origin[1]);
    const width = Math.abs(clientX - origin[0]);
    const height = Math.abs(clientY - origin[1]);
    const right = left + width;
    const bottom = top + height;

    const nextTargets = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, node] of engine.nodes.entries()) {
      if (node.api.getRect) {
        const rect = node.api.getRect();
        const [x, y] = [rect.left + rect.width / 2, rect.top + rect.height / 2];

        if (x >= left && x <= right && top <= y && bottom >= y) {
          nextTargets.push(key);
        }
      }
    }

    engine.selection.replace(nextTargets);
  };

  return <GroupSelectionContext.Provider value={{ ref, origin, onStart, onStop, updateActiveTargets }}>{children}</GroupSelectionContext.Provider>;
};

export const withGroupSelection = withContext(GroupSelectionContext, 'groupSelection');
