import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

const useIfManager = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts>();
  const { onAdd, onReorder, onRemove } = EditorV2.useSyncDynamicPorts();

  const onUpdateExpressions = React.useCallback(
    (expressions: Realtime.ExpressionData[], save?: boolean) => editor.onChange({ expressions }, save),
    [editor.onChange]
  );

  return useManager(editor.data.expressions, onUpdateExpressions, {
    onAdd,
    onRemove,
    onReorder,
  });
};

export default useIfManager;
