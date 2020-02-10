import React from 'react';

import { BlockType } from '@/constants';
import CombinedBlock from '@/pages/Canvas/components/CombinedBlock';
import HomeBlock from '@/pages/Canvas/components/HomeBlock';
import { EngineContext, useNode } from '@/pages/Canvas/contexts';
import { getNextSteps } from '@/pages/Canvas/utils';

function GroupNodeRenderer(_, ref) {
  const { node } = useNode();
  const engine = React.useContext(EngineContext);

  // eslint-disable-next-line default-case
  switch (node.type) {
    case BlockType.START:
      return <HomeBlock ref={ref} />;
    case BlockType.COMBINED:
      /* eslint-disable no-case-declarations */
      const lastNestedNode = node.combinedNodes.length && engine.getNodeByID(node.combinedNodes[node.combinedNodes.length - 1]);
      let nextSteps = getNextSteps(lastNestedNode.type);

      if (node.combinedNodes.find((nodeId) => engine.getNodeByID(nodeId).type === BlockType.INTENT)) {
        nextSteps = nextSteps.filter((step) => step.value !== BlockType.INTENT);
      }
      /* eslint-enable no-case-declarations */

      return <CombinedBlock nextSteps={nextSteps} ref={ref} />;
  }

  return null;
}

export default React.forwardRef(GroupNodeRenderer);
