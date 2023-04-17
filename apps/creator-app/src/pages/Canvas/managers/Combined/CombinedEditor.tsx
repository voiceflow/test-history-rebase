import * as Realtime from '@voiceflow/realtime-sdk';

import { useSetup } from '@/hooks';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

const CombinedEditor: NodeEditorV2<Realtime.NodeData.Combined> = ({ node, engine }) => {
  useSetup(() => {
    const firstNodeID = node.combinedNodes[0];

    if (firstNodeID) {
      engine.focusNode(firstNodeID, { open: true });
    } else {
      engine.clearActivation();
    }
  });

  return null;
};

export default CombinedEditor;
