import type { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { ActionCreator } from 'typescript-fsa';

import type { State } from '@/ducks';
import type { ActionInvalidator } from '@/ducks/utils';
import { createInvalidator } from '@/ducks/utils';

import { linksByPortIDSelector, parentNodeIDByStepIDSelector } from '../../selectors';

export const createDiagramInvalidator = <
  Origin extends Realtime.BaseDiagramPayload,
  Payload extends Realtime.BaseDiagramPayload,
>(
  actionCreator: ActionCreator<Payload>,
  invalidate: (origin: Origin, subject: Payload) => boolean
): ActionInvalidator<Origin, Payload> =>
  createInvalidator(
    actionCreator,
    (origin, subject) => origin.diagramID === subject.diagramID && invalidate(origin, subject)
  );

export const DIAGRAM_INVALIDATORS: ActionInvalidator<Realtime.BaseDiagramPayload, any>[] = [
  createInvalidator(Realtime.diagram.crud.remove, (origin, subject) => origin.diagramID === subject.key),
  createInvalidator(Realtime.diagram.crud.removeMany, (origin, subject) => subject.keys.includes(origin.diagramID)),
];

export const remapsTargetSamePorts = (
  originPortRemaps?: Realtime.NodePortRemap[],
  subjectPortRemaps?: Realtime.NodePortRemap[]
) =>
  !!originPortRemaps?.some((originPortRemap) =>
    subjectPortRemaps?.some((subjectPortRemap) =>
      originPortRemap.ports.some((originPort) =>
        subjectPortRemap.ports.some((subjectPort) => originPort.portID === subjectPort.portID)
      )
    )
  );

export const createNodeRemovalInvalidators = <Origin extends Realtime.BaseDiagramPayload>(
  compareNode: (origin: Origin, nodeID: string) => boolean
) => [
  createDiagramInvalidator(
    Realtime.node.transplantSteps,
    (origin: Origin, subject) => !!subject.removeSource && compareNode(origin, subject.sourceParentNodeID)
  ),
  createDiagramInvalidator(Realtime.node.removeMany, (origin: Origin, subject) =>
    subject.nodes.some((node) => compareNode(origin, node.stepID ?? node.parentNodeID))
  ),
  createDiagramInvalidator(Realtime.node.insertStep, (origin: Origin, subject) =>
    subject.removeNodes.some((node) => compareNode(origin, node.stepID ?? node.parentNodeID))
  ),
  createDiagramInvalidator(Realtime.node.insertManySteps, (origin: Origin, subject) =>
    subject.removeNodes.some((node) => compareNode(origin, node.stepID ?? node.parentNodeID))
  ),
  createDiagramInvalidator(Realtime.node.transplantSteps, (origin: Origin, subject) =>
    subject.removeNodes.some((node) => compareNode(origin, node.stepID ?? node.parentNodeID))
  ),
  createDiagramInvalidator(Realtime.node.reorderSteps, (origin: Origin, subject) =>
    subject.removeNodes.some((node) => compareNode(origin, node.stepID ?? node.parentNodeID))
  ),
  createDiagramInvalidator(Realtime.port.removeBuiltin, (origin: Origin, subject) =>
    subject.removeNodes.some((node) => compareNode(origin, node.stepID ?? node.parentNodeID))
  ),
  createDiagramInvalidator(Realtime.port.removeDynamic, (origin: Origin, subject) =>
    subject.removeNodes.some((node) => compareNode(origin, node.stepID ?? node.parentNodeID))
  ),
  createDiagramInvalidator(Realtime.port.removeManyByKey, (origin: Origin, subject) =>
    subject.removeNodes.some((node) => compareNode(origin, node.stepID ?? node.parentNodeID))
  ),
];

export const createManyNodesRemovalInvalidators = <Origin extends Realtime.BaseDiagramPayload>(
  getNodes: (origin: Origin) => Realtime.node.RemoveManyPayload['nodes']
) => [
  ...createNodeRemovalInvalidators((origin: Origin, nodeID) =>
    getNodes(origin).some((node) => (node.stepID ?? node.parentNodeID) === nodeID)
  ),
  createDiagramInvalidator(Realtime.node.insertStep, (origin: Origin, subject) =>
    getNodes(origin).some((node) => node.parentNodeID === subject.parentNodeID)
  ),
  createDiagramInvalidator(Realtime.node.reorderSteps, (origin: Origin, subject) =>
    getNodes(origin).some((node) => node.parentNodeID === subject.parentNodeID)
  ),
  createDiagramInvalidator(Realtime.node.moveMany, (origin: Origin, subject) =>
    getNodes(origin).some((node) => !!subject.blocks[node.parentNodeID])
  ),
  createDiagramInvalidator(Realtime.node.updateDataMany, (origin: Origin, subject) =>
    getNodes(origin).some((originNode) => subject.nodes.some((subjectNode) => originNode.stepID === subjectNode.nodeID))
  ),
  createDiagramInvalidator(Realtime.port.addBuiltin, (origin: Origin, subject) =>
    getNodes(origin).some((node) => (node.stepID ?? node.parentNodeID) === subject.nodeID)
  ),
  createDiagramInvalidator(Realtime.port.addBuiltin, (origin: Origin, subject) =>
    getNodes(origin).some((node) => (node.stepID ?? node.parentNodeID) === subject.nodeID)
  ),
  createDiagramInvalidator(Realtime.port.addDynamic, (origin: Origin, subject) =>
    getNodes(origin).some((node) => (node.stepID ?? node.parentNodeID) === subject.nodeID)
  ),
  createDiagramInvalidator(Realtime.port.reorderDynamic, (origin: Origin, subject) =>
    getNodes(origin).some((node) => (node.stepID ?? node.parentNodeID) === subject.nodeID)
  ),
  createDiagramInvalidator(Realtime.link.addBuiltin, (origin: Origin, subject) =>
    getNodes(origin).some((node) =>
      [subject.sourceNodeID, subject.targetNodeID].includes(node.stepID ?? node.parentNodeID)
    )
  ),
  createDiagramInvalidator(Realtime.link.addByKey, (origin: Origin, subject) =>
    getNodes(origin).some((node) =>
      [subject.sourceNodeID, subject.targetNodeID].includes(node.stepID ?? node.parentNodeID)
    )
  ),
  createDiagramInvalidator(Realtime.link.addDynamic, (origin: Origin, subject) =>
    getNodes(origin).some((node) =>
      [subject.sourceNodeID, subject.targetNodeID].includes(node.stepID ?? node.parentNodeID)
    )
  ),
];

export const createNodeIndexInvalidators = <Origin extends Realtime.BaseDiagramPayload>(
  getIndex: (origin: Origin) => { index: number; parentNodeID: string }
) => [
  createDiagramInvalidator(Realtime.node.insertStep, (origin: Origin, subject) => {
    const { index, parentNodeID } = getIndex(origin);
    return parentNodeID === subject.parentNodeID && index >= subject.index;
  }),
  createDiagramInvalidator(Realtime.node.transplantSteps, (origin: Origin, subject) => {
    const { index, parentNodeID } = getIndex(origin);
    return parentNodeID === subject.targetParentNodeID && index >= subject.index;
  }),
  createDiagramInvalidator(Realtime.node.reorderSteps, (origin: Origin, subject) => {
    const { parentNodeID } = getIndex(origin);
    return parentNodeID === subject.parentNodeID;
  }),
  createDiagramInvalidator(Realtime.node.removeMany, (origin: Origin, subject) => {
    const { parentNodeID } = getIndex(origin);
    return subject.nodes.some((node) => node.parentNodeID === parentNodeID);
  }),
  createDiagramInvalidator(Realtime.node.insertStep, (origin: Origin, subject) => {
    const { parentNodeID } = getIndex(origin);
    return subject.removeNodes.some((node) => node.parentNodeID === parentNodeID);
  }),
  createDiagramInvalidator(Realtime.node.insertManySteps, (origin: Origin, subject) => {
    const { parentNodeID } = getIndex(origin);
    return subject.removeNodes.some((node) => node.parentNodeID === parentNodeID);
  }),
  createDiagramInvalidator(Realtime.node.transplantSteps, (origin: Origin, subject) => {
    const { parentNodeID } = getIndex(origin);
    return subject.removeNodes.some((node) => node.parentNodeID === parentNodeID);
  }),
  createDiagramInvalidator(Realtime.node.reorderSteps, (origin: Origin, subject) => {
    const { parentNodeID } = getIndex(origin);
    return subject.removeNodes.some((node) => node.parentNodeID === parentNodeID);
  }),
];

export const createNodePortRemapsInvalidators = <Origin extends Realtime.BaseDiagramPayload>(
  getRemaps: (origin: Origin) => { nodePortRemaps: Realtime.NodePortRemap[]; parentNodeID: string }
) => [
  createDiagramInvalidator(Realtime.node.insertStep, (origin: Origin, subject) => {
    const { nodePortRemaps, parentNodeID } = getRemaps(origin);
    return parentNodeID === subject.parentNodeID && remapsTargetSamePorts(nodePortRemaps, subject.nodePortRemaps);
  }),
  createDiagramInvalidator(Realtime.node.transplantSteps, (origin: Origin, subject) => {
    const { nodePortRemaps, parentNodeID } = getRemaps(origin);
    return (
      (parentNodeID === subject.targetParentNodeID || parentNodeID === subject.sourceParentNodeID) &&
      remapsTargetSamePorts(nodePortRemaps, subject.nodePortRemaps)
    );
  }),
  createDiagramInvalidator(Realtime.node.reorderSteps, (origin: Origin, subject) => {
    const { nodePortRemaps, parentNodeID } = getRemaps(origin);
    return parentNodeID === subject.parentNodeID && remapsTargetSamePorts(nodePortRemaps, subject.nodePortRemaps);
  }),
  createDiagramInvalidator(Realtime.link.patchMany, (origin: Origin, subject) => {
    const { nodePortRemaps } = getRemaps(origin);
    return !!nodePortRemaps?.some((portRemap) =>
      portRemap.ports.some((port) => subject.patches.some((patch) => patch.portID === port.portID))
    );
  }),
];

export const buildLinkRecreateActions = (
  state: State,
  ctx: Realtime.BaseDiagramPayload,
  portRemap: Realtime.NodePortRemap
) =>
  portRemap.ports.flatMap((port) => {
    const links = linksByPortIDSelector(state, { id: port.portID });

    return links.map((link) => {
      const payload = {
        ...ctx,
        sourceParentNodeID: parentNodeIDByStepIDSelector(state, { id: portRemap.nodeID }),
        sourceNodeID: portRemap.nodeID,
        sourcePortID: port.portID!,
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
