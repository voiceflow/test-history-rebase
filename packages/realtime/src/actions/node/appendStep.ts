import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

import { extractNodes } from './utils';

class AppendStep extends AbstractDiagramActionControl<Realtime.node.AppendStepPayload> {
  actionCreator = Realtime.node.appendStep;

  process = async (ctx: Context, { payload }: Action<Realtime.node.AppendStepPayload>): Promise<void> => {
    const { diagramID, blockID, stepID, data, ports, projectMeta, schemaVersion } = payload;

    const [step] = extractNodes(diagramID, projectMeta, schemaVersion, {
      data: { [stepID]: data },
      ports: { [stepID]: ports },
      nodes: [
        {
          id: stepID,
          type: data.type,
          x: 0,
          y: 0,
          parentNode: blockID,
          ports: Realtime.Utils.port.extractNodePorts(ports),
          combinedNodes: [],
        },
      ],
    });

    await this.services.diagram.addStep(ctx.data.creatorID, diagramID, blockID, step);
  };
}

export default AppendStep;
