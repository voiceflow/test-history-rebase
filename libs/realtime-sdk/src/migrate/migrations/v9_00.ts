import { isIntentDBNode, isStartDBNode } from '@realtime-sdk/utils/typeGuards';
import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { NodeSystemPortType, NodeType, TriggerNode, TriggerNodeItemType } from '@voiceflow/dtos';

import { Transform } from './types';

// migrates intent steps to triggers
const migrateToV9_00: Transform = ({ diagrams }) => {
  diagrams.forEach((diagram) => {
    const isComponentDiagram = diagram.type === BaseModels.Diagram.DiagramType.COMPONENT;

    Object.values(diagram.nodes).forEach((node) => {
      // migrating default start node colors to green
      if (isComponentDiagram && isStartDBNode(node) && node.data.color === '#43494E') {
        Object.assign(node.data, { color: '#56b365' });
      } else if (isIntentDBNode(node)) {
        const nextPort = node.data.portsV2?.builtIn[BaseModels.PortType.NEXT];

        const triggerNode: TriggerNode = {
          ...Utils.object.pick(node, ['nodeID', 'coords']),
          type: NodeType.TRIGGER,
          data: {
            name: node.data.name,
            items: node.data.intent
              ? [
                  {
                    id: Utils.id.cuid(),
                    type: TriggerNodeItemType.INTENT,
                    mappings: node.data.mappings,
                    settings: { local: node.data.availability === BaseNode.Intent.IntentAvailability.LOCAL },
                    resourceID: node.data.intent,
                  },
                ]
              : [],
            portsV2: {
              dynamic: [],
              builtIn: {},
              byKey: {
                [NodeSystemPortType.NEXT]: {
                  ...nextPort,
                  id: nextPort?.id ?? Utils.id.cuid(),
                  type: NodeSystemPortType.NEXT,
                  target: nextPort?.target ?? null,
                },
              },
            },
          },
        };

        Object.assign(node, triggerNode);
      }
    });
  });
};

export default migrateToV9_00;
