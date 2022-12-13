import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import _isEqual from 'lodash/isEqual';
import * as Normal from 'normal-store';

import { createReverter } from '@/ducks/utils';

import { linksByIDsSelector } from '../selectors';
import { createActiveDiagramReducer, createDiagramInvalidator, createNodeRemovalInvalidators, DIAGRAM_INVALIDATORS } from './utils';

const patchManyLinksReducer = createActiveDiagramReducer(Realtime.link.patchMany, (state, { patches }) => {
  patches.forEach(({ linkID, data }) => {
    const link = Normal.getOne(state.links, linkID);

    if (!link) return;

    link.data = { ...link.data, ...data };
  });
});

export default patchManyLinksReducer;

export const remapTargetsPatchedLink = (portRemaps: Realtime.NodePortRemap[], patches: Realtime.link.LinkPatch[]) =>
  patches.some((patch) => portRemaps.some((portRemap) => portRemap.ports.some((port) => port.portID === patch.portID)));

export const patchManyLinksReverter = createReverter(
  Realtime.link.patchMany,

  ({ workspaceID, projectID, versionID, domainID, diagramID, patches }, getState) => {
    const patchesByID = Utils.array.createMap(patches, (patch) => patch.linkID);

    const links = linksByIDsSelector(getState(), { ids: Object.keys(patchesByID) });
    const prevPatches: Realtime.link.LinkPatch[] = links
      .map((link) => ({
        nodeID: link.source.nodeID,
        portID: link.source.portID,
        linkID: link.id,
        data: link.data ?? {},
      }))
      .filter((prevPatch) => {
        const { nodeID, portID, linkID, data } = patchesByID[prevPatch.linkID];
        const nextPatch = { nodeID, portID, linkID, data: data ?? {} };

        return !_isEqual(prevPatch, nextPatch);
      });

    if (!prevPatches.length) return null;

    return Realtime.link.patchMany({ workspaceID, projectID, versionID, domainID, diagramID, patches: prevPatches });
  },

  [
    ...DIAGRAM_INVALIDATORS,
    ...createNodeRemovalInvalidators<Realtime.link.PatchManyPayload>((origin, nodeID) => origin.patches.some((patch) => patch.nodeID === nodeID)),
    createDiagramInvalidator(Realtime.node.insertStep, (origin, subject) => remapTargetsPatchedLink(subject.nodePortRemaps ?? [], origin.patches)),
    createDiagramInvalidator(Realtime.node.transplantSteps, (origin, subject) =>
      remapTargetsPatchedLink(subject.nodePortRemaps ?? [], origin.patches)
    ),
    createDiagramInvalidator(Realtime.node.reorderSteps, (origin, subject) => remapTargetsPatchedLink(subject.nodePortRemaps ?? [], origin.patches)),
    createDiagramInvalidator(Realtime.port.removeBuiltin, (origin, subject) => origin.patches.some((patch) => patch.portID === subject.portID)),
    createDiagramInvalidator(Realtime.port.removeManyByKey, (origin, subject) =>
      origin.patches.some((patch) => patch.nodeID === subject.nodeID && patch.key && subject.keys.includes(patch.key))
    ),
    createDiagramInvalidator(Realtime.port.removeDynamic, (origin, subject) => origin.patches.some((patch) => patch.portID === subject.portID)),
    createDiagramInvalidator(Realtime.link.patchMany, (origin, subject) =>
      origin.patches.some((originPatch) => subject.patches.some((patch) => originPatch.linkID === patch.linkID))
    ),
    createDiagramInvalidator(Realtime.link.removeMany, (origin, subject) =>
      origin.patches.some((originPatch) => subject.links.some((link) => originPatch.linkID === link.linkID))
    ),
  ]
);
