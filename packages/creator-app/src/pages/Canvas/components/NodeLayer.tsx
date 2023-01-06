import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as CustomBlock from '@/ducks/customBlock';
import { useDispatch, useFeature, useSelector } from '@/hooks';
import Node from '@/pages/Canvas/components/Node';
import { NodeEntityProvider } from '@/pages/Canvas/contexts';

const useCustomBlockPortsSync = () => {
  const syncCustomBlockPorts = useDispatch(CustomBlock.syncCustomBlockPorts);
  const allCustomBlocks = useSelector(CustomBlock.allCustomBlocksSelector);
  const mvpCustomBlocks = useFeature(Realtime.FeatureFlag.MVP_CUSTOM_BLOCK);

  React.useEffect(() => {
    if (mvpCustomBlocks.isEnabled) {
      syncCustomBlockPorts();
    }
  }, [allCustomBlocks]);
};

const NodeLayer: React.OldFC = () => {
  const blockIDs = useSelector(CreatorV2.blockIDsSelector);

  useCustomBlockPortsSync();

  return (
    <>
      {blockIDs.map((blockID) => (
        <NodeEntityProvider id={blockID} key={blockID}>
          <Node />
        </NodeEntityProvider>
      ))}
    </>
  );
};

export default React.memo(NodeLayer);
