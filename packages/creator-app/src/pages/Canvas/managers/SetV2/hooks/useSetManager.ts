import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { setClone, setFactory } from '../utils';

const useSetManager = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts>();
  const { onAdd, onReorder, onRemove } = EditorV2.useSyncDynamicPorts();

  const onUpdateSets = React.useCallback(
    (sets: Realtime.NodeData.SetExpressionV2[], save?: boolean) => editor.onChange({ sets }, save),
    [editor.onChange]
  );

  return useManager(editor.data.sets, onUpdateSets, {
    onAdd,
    factory: () => setFactory(),
    clone: setClone,
    onRemove,
    onReorder,
  });
};

export default useSetManager;
