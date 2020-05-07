import React from 'react';

import { BlockType } from '@/constants';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';

import { SidebarContext } from './contexts';

const DEFAULT_SIDEBAR_HEADER_ACTIONS = [
  {
    value: 'duplicate_block',
    label: 'Duplicate',
    onClick: ({ data, engine }) => engine.node.duplicate(data.nodeID),
  },
  {
    value: 'delete_block',
    label: 'Delete',
    onClick: ({ data, engine }) => engine.node.remove(data.nodeID),
  },
];

const generatePath = (node, parent, engine) => (getManager) => {
  if (!node) {
    return [];
  }

  const blockPath = [{ label: (node.type !== BlockType.COMBINED && getManager(node.type)?.label) || 'Block' }];

  return parent
    ? [
        {
          label: (node.type !== BlockType.COMBINED && getManager(parent.type)?.label) || 'Block',
          focus: () => engine.focus.set(parent.nodeID),
        },
        ...blockPath,
      ]
    : blockPath;
};

// eslint-disable-next-line import/prefer-default-export
export const useEditorPath = (node, parent) => {
  const getManager = React.useContext(ManagerContext);
  const engine = React.useContext(EngineContext);
  const originalPath = React.useMemo(() => generatePath(node, parent, engine)(getManager), [node, parent, engine, getManager]);
  const [path, updatePath] = React.useState(originalPath);

  const goToPath = React.useCallback(
    (index) =>
      updatePath((prevPath) => {
        const newPath = prevPath.slice(0, index + 1);

        newPath[newPath.length - 1]?.focus?.();

        return newPath;
      }),
    [updatePath]
  );
  const pushToPath = React.useCallback((subPath) => updatePath((prevPath) => [...prevPath, subPath]), [updatePath]);
  const popFromPath = React.useCallback(() => updatePath((prevPath) => prevPath.slice(0, -1)), [updatePath]);

  React.useEffect(() => {
    updatePath(originalPath);
  }, [originalPath]);

  return { path, goToPath, pushToPath, popFromPath };
};

export const useHeaderActions = (headerActions = DEFAULT_SIDEBAR_HEADER_ACTIONS) => {
  const sidebar = React.useContext(SidebarContext);

  React.useEffect(() => {
    sidebar.updateState({ headerActions });
  }, [sidebar.updateState, headerActions]);
};

export const useUpdateData = (nodeID) => {
  // We've removed useSelector hook because it sometimes has stale redux values which was causing some insane bugs, now we pass in nodeID to ensure the editor sidebar is referencing / updating the correct node
  const engine = React.useContext(EngineContext);

  return React.useCallback((value, save = true) => nodeID && engine.node.updateData(nodeID, value, save), [engine.node, nodeID]);
};
