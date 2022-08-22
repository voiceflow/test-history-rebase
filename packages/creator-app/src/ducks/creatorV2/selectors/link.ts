import { Utils } from '@voiceflow/common';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { createCurriedSelector, createParameterSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { creatorStateSelector } from './base';

export const allLinkIDsSelector = createSelector([creatorStateSelector], ({ links }) => links.allKeys);

export const allLinksSelector = createSelector([creatorStateSelector], ({ links }) => Normal.denormalize(links));

export const linkByIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ links }, linkID) =>
  linkID ? Normal.getOne(links, linkID) : null
);

export const linksByIDsSelector = createSelector([creatorStateSelector, idsParamSelector], ({ links }, linkIDs) => Normal.getMany(links, linkIDs));

export const linkIDsByNodeIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ linkIDsByNodeID }, nodeID) =>
  nodeID ? linkIDsByNodeID[nodeID] ?? [] : []
);

export const hasLinksByNodeIDSelector = createSelector([linkIDsByNodeIDSelector], (linkIDs) => !!linkIDs.length);

export const linksByNodeIDSelector = createSelector([creatorStateSelector, linkIDsByNodeIDSelector], ({ links }, linkIDs) =>
  Normal.getMany(links, linkIDs)
);

export const linkIDsByPortIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ linkIDsByPortID }, portID) =>
  portID ? linkIDsByPortID[portID] ?? [] : []
);

export const getLinkIDsByPortIDSelector = createCurriedSelector(linkIDsByPortIDSelector);

export const hasLinksByPortIDSelector = createSelector([linkIDsByPortIDSelector], (linkIDs) => !!linkIDs.length);

export const linksByPortIDSelector = createSelector([creatorStateSelector, linkIDsByPortIDSelector], ({ links }, linkIDs) =>
  Normal.getMany(links, linkIDs)
);

export const getLinksByPortIDSelector = createCurriedSelector(linksByPortIDSelector);

interface JoiningLinkIDsSelectorParam {
  sourceNodeID: string;
  targetNodeID: string;
  directional?: boolean;
}

const sourceIDParamSelector = createParameterSelector((params: JoiningLinkIDsSelectorParam) => params.sourceNodeID);
const targetIDParamSelector = createParameterSelector((params: JoiningLinkIDsSelectorParam) => params.targetNodeID);
const directionalParamSelector = createParameterSelector((params: JoiningLinkIDsSelectorParam) => !!params.directional);

export const joiningLinkIDsSelector = createSelector(
  [creatorStateSelector, sourceIDParamSelector, targetIDParamSelector, directionalParamSelector],
  ({ links, linkIDsByNodeID }, sourceNodeID, targetNodeID, directional) => {
    const sourceLinkIDs = linkIDsByNodeID[sourceNodeID] ?? [];
    const targetLinkIDs = linkIDsByNodeID[targetNodeID] ?? [];
    const { union: joiningLinkIDs } = Utils.array.findUnion(sourceLinkIDs, targetLinkIDs);

    return directional
      ? joiningLinkIDs.filter((linkID) => {
          const link = Normal.getOne(links, linkID);
          if (!link) return false;

          return link.source.nodeID === sourceNodeID && link.target.nodeID === targetNodeID;
        })
      : joiningLinkIDs;
  }
);
