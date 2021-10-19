import React from 'react';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { NodeData } from '@/models';
import { EngineContext, ManagerContext, ManagerGetter } from '@/pages/Canvas/contexts';
import type { Engine } from '@/pages/Canvas/engine/';
import { NodeDataUpdater } from '@/pages/Canvas/types';

import { SidebarContext, SidebarHeaderAction } from './contexts';

const DEFAULT_SIDEBAR_HEADER_ACTIONS: SidebarHeaderAction[] = [
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

export interface PathEntry {
  label: string;
  focus?: () => void;
  type?: string;
}

const generatePath =
  ({
    type,
    engine,
    updatePath,
    parentType,
    parentNodeID,
  }: {
    type?: BlockType | null;
    engine: Engine;
    updatePath: (entries: PathEntry[]) => void;
    parentType?: BlockType | null;
    parentNodeID?: string | null;
  }) =>
  (getManager: ManagerGetter): PathEntry[] => {
    if (!type) {
      return [];
    }

    const blockPath = [{ label: (type !== BlockType.COMBINED && getManager(type)?.label) || 'Block' }];

    return parentType && parentNodeID
      ? [
          {
            label: (type !== BlockType.COMBINED && getManager(parentType)?.label) || 'Block',
            focus: () => engine.focus.set(parentNodeID),
          },
          ...(parentType === BlockType.START
            ? [
                {
                  label: 'Commands',
                  focus: () => {
                    engine.focus.set(parentNodeID);
                    updatePath([{ label: getManager(BlockType.START)?.label || 'Block' }, { label: 'Commands', type: 'commands' }]);
                  },
                },
              ]
            : []),
          ...blockPath,
        ]
      : blockPath;
  };

// eslint-disable-next-line import/prefer-default-export
export const useEditorPath = () => {
  const getManager = React.useContext(ManagerContext)!;
  const engine = React.useContext(EngineContext)!;

  const node = engine.select(Creator.focusedNodeSelector);
  let parent: NodeData<unknown> | null = null;

  if (node?.parentNode) {
    parent = engine.select(Creator.dataByNodeIDSelector)(node.parentNode);
  }

  const updatePathRef = React.useRef<(entries: PathEntry[]) => void>(() => {});
  const skipOriginalPathRedirect = React.useRef(false);

  const originalPath = React.useMemo(
    () =>
      generatePath({
        type: node?.type,
        engine,
        updatePath: (entries: PathEntry[]) => {
          skipOriginalPathRedirect.current = true;

          updatePathRef.current(entries);
        },
        parentType: parent?.type,
        parentNodeID: parent?.nodeID,
      })(getManager),
    [node?.type, parent?.type, parent?.nodeID, engine, getManager]
  );
  const [path, updatePath] = React.useState(originalPath);

  const goToPath = React.useCallback(
    (index: number) =>
      updatePath((prevPath) => {
        const newPath = prevPath.slice(0, index + 1);

        newPath[newPath.length - 1]?.focus?.();

        return newPath;
      }),
    [updatePath]
  );
  const pushToPath = React.useCallback((subPath: PathEntry) => updatePath((prevPath) => [...prevPath, subPath]), [updatePath]);
  const popFromPath = React.useCallback(() => updatePath((prevPath) => prevPath.slice(0, -1)), [updatePath]);

  updatePathRef.current = updatePath;

  React.useEffect(() => {
    if (!skipOriginalPathRedirect.current) {
      updatePath(originalPath);
    } else {
      skipOriginalPathRedirect.current = false;
    }
  }, [originalPath]);

  return { node, path, goToPath, pushToPath, popFromPath };
};

export const useHeaderActions = (headerActions: SidebarHeaderAction[] = DEFAULT_SIDEBAR_HEADER_ACTIONS) => {
  const sidebar = React.useContext(SidebarContext)!;

  React.useEffect(() => {
    sidebar.updateState({ headerActions });
  }, [sidebar.updateState, headerActions]);
};

export const useUpdateData = (nodeID?: string | null): NodeDataUpdater<any> => {
  // We've removed useSelector hook because it sometimes has stale redux values which was causing some insane bugs
  // now we pass in nodeID to ensure the editor sidebar is referencing / updating the correct node
  const engine = React.useContext(EngineContext)!;

  return React.useCallback(
    async (value, save = true) => (nodeID ? engine.node.updateData(nodeID, value, save) : Promise.resolve()),
    [engine.node, nodeID]
  );
};
