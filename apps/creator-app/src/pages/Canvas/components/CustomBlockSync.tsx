import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as CustomBlock from '@/ducks/customBlock';
import { useDispatch, useFeature, useSelector } from '@/hooks';

const CustomBlockSync: React.FC = () => {
  const syncCustomBlockPorts = useDispatch(CustomBlock.syncCustomBlockPorts);
  const allCustomBlocks = useSelector(CustomBlock.allCustomBlocksSelector);
  const mvpCustomBlocks = useFeature(Realtime.FeatureFlag.MVP_CUSTOM_BLOCK);

  React.useEffect(() => {
    if (mvpCustomBlocks.isEnabled) {
      syncCustomBlockPorts();
    }
  }, [allCustomBlocks]);

  return null;
};

export default React.memo(CustomBlockSync);
