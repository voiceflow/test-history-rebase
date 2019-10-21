import React from 'react';

import { BlockType } from '@/constants';
import CombinedBlock from '@/containers/CanvasV2/components/CombinedBlock';
import HomeBlock from '@/containers/CanvasV2/components/HomeBlock';
import { EngineContext, useNode } from '@/containers/CanvasV2/contexts';
import { getNextSteps } from '@/containers/CanvasV2/utils';

function GroupNodeRenderer({ isActive }, ref) {
  const { node, data } = useNode();
  const engine = React.useContext(EngineContext);
  // eslint-disable-next-line default-case
  switch (data.type) {
    case BlockType.START:
      return <HomeBlock isActive={isActive} ref={ref} />;
    case BlockType.COMBINED:
      /* eslint-disable no-case-declarations */
      const lastNestedNode = node.combinedNodes.length && engine.getNodeByID(node.combinedNodes[node.combinedNodes.length - 1]);
      const nextSteps = getNextSteps(lastNestedNode.type);
      /* eslint-enable no-case-declarations */

      return <CombinedBlock isActive={isActive} nextSteps={nextSteps} ref={ref} />;
  }

  return null;
}

export default React.forwardRef(GroupNodeRenderer);
