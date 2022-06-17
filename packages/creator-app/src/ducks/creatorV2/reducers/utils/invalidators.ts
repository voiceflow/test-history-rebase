import * as Realtime from '@voiceflow/realtime-sdk';
import { ActionCreator } from 'typescript-fsa';

import { ActionInvalidator, createInvalidator } from '@/ducks/utils';

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
