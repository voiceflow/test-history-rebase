import * as Realtime from '@voiceflow/realtime-sdk';

import { useMapManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { expressionFactory, MAX_IF_ITEMS } from '@/pages/Canvas/managers/IfV2/constants';

const useIfManager = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts>();
  const syncDynamicPorts = EditorV2.useSyncDynamicPorts();

  return useMapManager(editor.data.expressions, (expressions) => editor.onChange({ expressions }), {
    ...syncDynamicPorts,
    clone: ({ id }, targetVal) => ({ ...targetVal, id }),
    factory: expressionFactory,
    maxItems: MAX_IF_ITEMS,
  });
};

export default useIfManager;
