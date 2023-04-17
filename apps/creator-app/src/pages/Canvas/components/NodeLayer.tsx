import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import Node from '@/pages/Canvas/components/Node';
import { NodeEntityProvider } from '@/pages/Canvas/contexts';

const NodeLayer: React.FC = () => {
  const blockIDs = useSelector(CreatorV2.blockIDsSelector);

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
