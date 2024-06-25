import type * as Realtime from '@voiceflow/realtime-sdk';
import type { OptionsMenuOption, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import { Path } from '@/config/routes';

import type { NodeEditorV2Props } from '../../managers/types';
import { EditorSidebarContext } from '../EditorSidebarV2';
import { EditorParentMatchContext } from './context';

export const useParentMatch = () => {
  const parentMatch = React.useContext(EditorParentMatchContext);

  return React.useMemo(() => {
    if (!parentMatch) return null;

    const parentPath = parentMatch.path.replace(Path.CANVAS_NODE, '');

    return {
      ...parentMatch,
      parentUrl: generatePath(parentPath, parentMatch.params),
      parentPath,
    };
  }, [parentMatch?.url]);
};

export const useEditor = <
  Data,
  BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
>(): NodeEditorV2Props<Data, BuiltInPorts> => {
  const editor = React.useContext(EditorSidebarContext)! as NodeEditorV2Props<Data, BuiltInPorts>;
  const parentMatch = useParentMatch();

  const goBack: typeof editor.goBack = React.useCallback(
    (path) => {
      if (!path && parentMatch?.parentUrl) {
        editor.goBack(parentMatch.parentUrl);
      } else if (!path || typeof path === 'string') {
        editor.goBack(path);
      } else {
        editor.goBack(path);
      }
    },
    [editor.goBack, parentMatch?.parentUrl]
  );

  return { ...editor, goBack };
};

export const useSyncDynamicPorts = (): {
  onAdd: (_: unknown, index: number) => Promise<void>;
  onRemove: (_: unknown, index: number) => Promise<void>;
  onReorder: (from: number, to: number) => Promise<void>;
} => {
  const editor = useEditor();

  const onAdd = React.useCallback(
    (_: unknown, index: number) => editor.engine.port.addDynamic(editor.nodeID, index),
    [editor.engine.port, editor.nodeID]
  );

  const onRemove = React.useCallback(
    (_: unknown, index: number) => editor.engine.port.removeDynamic(editor.node.ports.out.dynamic[index]),
    [editor.engine.port, editor.node.ports.out.dynamic]
  );

  const onReorder = React.useCallback(
    (from: number, to: number) => editor.engine.port.reorderDynamic(editor.nodeID, from, to),
    [editor.engine.port, editor.nodeID]
  );

  return { onAdd, onRemove, onReorder };
};

export const useEditorDefaultActions = () => {
  const editor = useEditor();

  const options: Array<OptionsMenuOption | UIOnlyMenuItemOption | null> = [
    { label: 'Duplicate', onClick: () => editor.engine.node.duplicateMany([editor.nodeID]) },
    { label: 'Delete', onClick: () => editor.engine.node.remove(editor.nodeID) },
  ];

  return options;
};
