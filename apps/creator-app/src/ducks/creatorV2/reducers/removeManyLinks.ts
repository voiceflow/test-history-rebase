import * as Realtime from '@voiceflow/realtime-sdk';

import { createReverter } from '@/ducks/utils';

import { linkByIDSelector, parentNodeIDByStepIDSelector } from '../selectors';
import { removeLink } from '../utils';
import { createActiveDiagramReducer, createDiagramInvalidator, DIAGRAM_INVALIDATORS } from './utils';

const removeManyLinksReducer = createActiveDiagramReducer(Realtime.link.removeMany, (state, { links }) => {
  links.forEach((link) => {
    removeLink(state, link.linkID);
  });
});

export default removeManyLinksReducer;

export const removeManyLinksReverter = createReverter(
  Realtime.link.removeMany,

  ({ workspaceID, projectID, versionID, domainID, diagramID, links }, getState) => {
    const ctx = { workspaceID, projectID, versionID, domainID, diagramID };
    const state = getState();

    return links.map((link) => {
      const prevLink = linkByIDSelector(state, { id: link.linkID });
      const sourceParentNodeID = parentNodeIDByStepIDSelector(state, { id: link.nodeID });
      const payload = {
        sourceParentNodeID,
        sourceNodeID: link.nodeID,
        sourcePortID: link.portID,
        targetNodeID: prevLink!.target.nodeID,
        targetPortID: prevLink!.target.portID,
        linkID: link.linkID,
        data: prevLink?.data,
      };

      if (link.type) {
        return Realtime.link.addBuiltin({ ...ctx, ...payload, type: link.type });
      }

      if (link.key) {
        return Realtime.link.addByKey({ ...ctx, ...payload, key: link.key });
      }

      return Realtime.link.addDynamic({ ...ctx, ...payload });
    });
  },

  [
    ...DIAGRAM_INVALIDATORS,
    createDiagramInvalidator(Realtime.link.removeMany, (origin, subject) =>
      origin.links.some((originLink) => subject.links.some((link) => link.nodeID === originLink.nodeID))
    ),
  ]
);
