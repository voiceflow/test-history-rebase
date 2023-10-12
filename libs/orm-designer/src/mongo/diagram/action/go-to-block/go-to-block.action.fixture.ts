import { blockNode } from '../../node/block/block.node.fixture';
import { NodeType } from '../../node/node-type.enum';
import { nextPort } from '../../port/port.fixture';
import { PortType } from '../../port/port-type.enum';
import type { GoToBlockAction } from './go-to-block.action';

export const goToBlockAction: GoToBlockAction = {
  id: 'go-to-block-action-1',
  parentID: 'actions-1',
  type: NodeType.ACTION__GO_TO_BLOCK__V3,

  data: {
    block: {
      diagramID: 'diagram-1',
      nodeID: blockNode.id,
    },
  } as any,

  ports: {
    [PortType.NEXT]: nextPort,
  },
};
