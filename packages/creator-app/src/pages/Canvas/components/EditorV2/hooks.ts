import * as Realtime from '@voiceflow/realtime-sdk';
import { OptionsMenuOption, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import { NodeEditorV2Props } from '../../managers/types';
import { EditorSidebarContext } from '../EditorSidebarV2';

export const useEditor = <Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>(): NodeEditorV2Props<
  Data,
  BuiltInPorts
> => {
  return React.useContext(EditorSidebarContext)! as NodeEditorV2Props<Data, BuiltInPorts>;
};

export const useSyncDynamicPorts = (): {
  onAdd: () => Promise<void>;
  onRemove: (_: unknown, index: number) => Promise<void>;
  onReorder: (from: number, to: number) => Promise<void>;
} => {
  const editor = useEditor();

  const onAdd = React.useCallback(() => editor.engine.port.addDynamic(editor.nodeID), [editor.engine.port, editor.nodeID]);

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
    { label: 'Duplicate', onClick: () => editor.engine.node.duplicate(editor.nodeID) },
    { label: 'Delete', onClick: () => editor.engine.node.remove(editor.nodeID) },
  ];

  return options;
};
