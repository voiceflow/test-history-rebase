import * as Realtime from '@voiceflow/realtime-sdk';

import { useMapManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { MAX_SETS } from '@/pages/Canvas/managers/SetV2/constants';

import { setClone, setFactory } from '../utils';

const useSetManager = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts>();
  const syncDynamicPorts = EditorV2.useSyncDynamicPorts();

  return useMapManager(editor.data.sets, (sets) => editor.onChange({ sets }), {
    ...syncDynamicPorts,
    clone: setClone,
    factory: setFactory,
    maxItems: MAX_SETS,
  });
};

export default useSetManager;
