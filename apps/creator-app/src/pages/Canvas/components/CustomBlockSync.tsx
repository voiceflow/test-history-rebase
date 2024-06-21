import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as CustomBlock from '@/ducks/customBlock';
import { useDispatch, useSelector } from '@/hooks';
import { useFeature } from '@/hooks/feature.hook';

const CustomBlockSync: React.FC = () => {
  const syncCustomBlockPorts = useDispatch(CustomBlock.syncCustomBlockPorts);
  const allCustomBlocks = useSelector(CustomBlock.allCustomBlocksSelector);
  const mvpCustomBlocks = useFeature(Realtime.FeatureFlag.MVP_CUSTOM_BLOCK);

  React.useEffect(() => {
    if (mvpCustomBlocks) {
      syncCustomBlockPorts();
    }
  }, [allCustomBlocks, mvpCustomBlocks]);

  return null;
};

export default React.memo(CustomBlockSync);
