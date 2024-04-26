import { Utils } from '@voiceflow/common';
import React from 'react';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import type { ManagerGetter } from '@/pages/Canvas/contexts';
import { EngineContext, ManagerContext } from '@/pages/Canvas/contexts';
import type Engine from '@/pages/Canvas/engine';
import type { NodeDataUpdater } from '@/pages/Canvas/types';

export interface PathEntry {
  id?: string;
  type?: string;
  label: string;
  focus?: () => void;
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
            focus: () => engine.setActive(parentNodeID),
          },
          ...(parentType === BlockType.START
            ? [
                {
                  label: 'Commands',
                  focus: () => {
                    engine.setActive(parentNodeID);
                    updatePath([
                      { label: getManager(BlockType.START)?.label || 'Block' },
                      { label: 'Commands', type: 'commands' },
                    ]);
                  },
                },
              ]
            : []),
          ...blockPath,
        ]
      : blockPath;
  };

export const useEditorPath = () => {
  const engine = React.useContext(EngineContext)!;
  const getManager = React.useContext(ManagerContext)!;

  const node = useSelector(CreatorV2.focusedNodeSelector);
  const blockID = node?.parentNode ?? null;
  const blockType = useSelector(CreatorV2.nodeTypeByIDSelector, { id: blockID });

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
        parentType: blockType,
        parentNodeID: blockID,
      })(getManager),
    [node?.type, blockType, blockID, engine, getManager]
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
  const pushToPath = React.useCallback(
    (subPath: PathEntry) => updatePath((prevPath) => [...prevPath, subPath]),
    [updatePath]
  );
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

export const useUpdateData = (nodeID?: string | null): NodeDataUpdater<any> => {
  // We've removed useSelector hook because it sometimes has stale redux values which was causing some insane bugs
  // now we pass in nodeID to ensure the editor sidebar is referencing / updating the correct node
  const engine = React.useContext(EngineContext)!;

  return React.useCallback(
    async (value) => {
      if (nodeID && !Utils.object.shallowPartialEquals(engine.getDataByNodeID(nodeID), value)) {
        return engine.node.updateData(nodeID, value);
      }
      return Promise.resolve();
    },
    [engine.node, nodeID]
  );
};
