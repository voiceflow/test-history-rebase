import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ActionCreator } from 'typescript-fsa';

import type { State } from '@/ducks';
import { ActionInvalidator, createInvalidator } from '@/ducks/utils';

import { blockIDByStepIDSelector, linksByPortIDSelector } from '../../selectors';

export const createDiagramInvalidator = <Origin extends Realtime.BaseDiagramPayload, Payload extends Realtime.BaseDiagramPayload>(
  actionCreator: ActionCreator<Payload>,
  invalidate: (origin: Origin, subject: Payload) => boolean
): ActionInvalidator<Origin, Payload> =>
  createInvalidator(actionCreator, (origin, subject) => origin.diagramID === subject.diagramID && invalidate(origin, subject));

export const DIAGRAM_INVALIDATORS: ActionInvalidator<Realtime.BaseDiagramPayload, any>[] = [
  createInvalidator(Realtime.diagram.crud.remove, (origin, subject) => origin.diagramID === subject.key),
  createInvalidator(Realtime.diagram.crud.removeMany, (origin, subject) => subject.keys.includes(origin.diagramID)),
  createInvalidator(Realtime.diagram.convertToTopic.started, (origin, subject) => origin.diagramID === subject.diagramID),
];

export const createNodeRemovalInvalidators = <Origin extends Realtime.BaseDiagramPayload>(
  compareNode: (origin: Origin, nodeID: string) => boolean
) => [
  createDiagramInvalidator(
    Realtime.node.isolateSteps,
    (origin: Origin, subject) => !!subject.removeSource && compareNode(origin, subject.sourceBlockID)
  ),
  createDiagramInvalidator(
    Realtime.node.transplantSteps,
    (origin: Origin, subject) => !!subject.removeSource && compareNode(origin, subject.sourceBlockID)
  ),
  createDiagramInvalidator(Realtime.node.removeMany, (origin: Origin, subject) =>
    subject.nodes.some((node) => compareNode(origin, node.stepID ?? node.blockID))
  ),
];

export const remapTargetsSamePorts = (originPortRemaps?: Realtime.NodePortRemap[], subjectPortRemaps?: Realtime.NodePortRemap[]) =>
  !!originPortRemaps?.some((originPortRemap) =>
    subjectPortRemaps?.some((subjectPortRemap) =>
      originPortRemap.ports.some((originPort) => subjectPortRemap.ports.some((subjectPort) => originPort.portID === subjectPort.portID))
    )
  );

export const buildLinkRecreateActions = (state: State, ctx: Realtime.BaseDiagramPayload, portRemap: Realtime.NodePortRemap) =>
  portRemap.ports.flatMap((port) => {
    const links = linksByPortIDSelector(state, { id: port.portID });

    return links.map((link) => {
      const payload = {
        ...ctx,
        sourceBlockID: blockIDByStepIDSelector(state, { id: portRemap.nodeID }),
        sourceNodeID: portRemap.nodeID,
        sourcePortID: port.portID,
        targetNodeID: link.target.nodeID,
        targetPortID: link.target.portID,
        linkID: link.id,
      };

      if (port.key) {
        return Realtime.link.addByKey({ ...payload, key: port.key });
      }

      if (port.type) {
        return Realtime.link.addBuiltin({ ...payload, type: port.type as BaseModels.PortType });
      }

      return Realtime.link.addDynamic(payload);
    });
  });
