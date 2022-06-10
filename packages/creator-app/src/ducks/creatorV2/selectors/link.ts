import { Utils } from '@voiceflow/common';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import * as CreatorV1Selectors from '@/ducks/creator/diagram/selectors';
import * as Feature from '@/ducks/feature';
import { createCurriedSelector, createParameterSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import { Selector } from '@/store/types';

import { creatorStateSelector } from './base';

const _allLinkIDsSelector = createSelector([creatorStateSelector], ({ links }) => links.allKeys);
export const allLinkIDsSelector = Feature.createAtomicActionsPhase2Selector([CreatorV1Selectors.allLinkIDsSelector, _allLinkIDsSelector]);

const _allLinksSelector = createSelector([creatorStateSelector], ({ links }) => Normal.denormalize(links));
export const allLinksSelector = Feature.createAtomicActionsPhase2Selector([CreatorV1Selectors.allLinksSelector, _allLinksSelector]);

const _linkByIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ links }, linkID) =>
  linkID ? Normal.getOne(links, linkID) : null
);
export const linkByIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.linkByIDSelector, _linkByIDSelector, idParamSelector],
  (getLinkV1, linkV2, linkID) => [linkID ? getLinkV1(linkID) : null, linkV2]
);

export const linksByIDsSelector = createSelector([creatorStateSelector, idsParamSelector], ({ links }, linkIDs) => Normal.getMany(links, linkIDs));

const _linkIDsByNodeIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ linkIDsByNodeID }, nodeID) =>
  nodeID ? linkIDsByNodeID[nodeID] ?? [] : []
);
export const linkIDsByNodeIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.linkIDsByNodeIDSelector, _linkIDsByNodeIDSelector, idParamSelector],
  (getLinkIDsV1, linkIDsV2, nodeID) => [nodeID ? getLinkIDsV1(nodeID) : [], linkIDsV2]
);

export const hasLinksByNodeIDSelector = createSelector([linkIDsByNodeIDSelector], (linkIDs) => !!linkIDs.length);

const _linksByNodeIDSelector = createSelector([creatorStateSelector, linkIDsByNodeIDSelector], ({ links }, linkIDs) =>
  Normal.getMany(links, linkIDs)
);
export const linksByNodeIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.linksByNodeIDSelector, _linksByNodeIDSelector, idParamSelector],
  (getLinksV1, linksV2, nodeID) => [nodeID ? getLinksV1(nodeID) : [], linksV2]
);

const _linkIDsByPortIDSelector = createSelector([creatorStateSelector, idParamSelector], ({ linkIDsByPortID }, portID) =>
  portID ? linkIDsByPortID[portID] ?? [] : []
);
export const linkIDsByPortIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.linkIDsByPortIDSelector, _linkIDsByPortIDSelector, idParamSelector],
  (getLinkIDsV1, linkIDsV2, portID) => [portID ? getLinkIDsV1(portID) : [], linkIDsV2]
);

export const getLinkIDsByPortIDSelector = createCurriedSelector(linkIDsByPortIDSelector);

export const hasLinksByPortIDSelector = createSelector([linkIDsByPortIDSelector], (linkIDs) => !!linkIDs.length);

const _linksByPortIDSelector = createSelector([creatorStateSelector, linkIDsByPortIDSelector], ({ links }, linkIDs) =>
  Normal.getMany(links, linkIDs)
);
export const linksByPortIDSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.linksByPortIDSelector, _linksByPortIDSelector, idParamSelector],
  (getLinksV1, linksV2, portID) => [portID ? getLinksV1(portID) : [], linksV2]
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

const _joiningLinkIDsSelector = createSelector(
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
export const joiningLinkIDsSelector = Feature.createAtomicActionsPhase2Selector(
  [CreatorV1Selectors.joiningLinkIDsSelector, _joiningLinkIDsSelector, sourceIDParamSelector, targetIDParamSelector, directionalParamSelector],
  (getLinkIDsV1, linksV2, sourceNodeID, targetNodeID, directional) => [getLinkIDsV1(sourceNodeID, targetNodeID, directional), linksV2]
) as Selector<string[], [JoiningLinkIDsSelectorParam]>;
