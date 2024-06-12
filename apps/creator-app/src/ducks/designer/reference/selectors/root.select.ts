import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { createCurriedSelector, referrerIDParamSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { createDesignerSelector } from '../../utils/selector.util';
import { STATE_KEY } from '../reference.state';

const DEFAULT_IDS: string[] = [];

export const root = createDesignerSelector(STATE_KEY);

export const normalizedResources = createSelector([root], ({ resources }) => resources);

export const normalizedReferences = createSelector([root], ({ references }) => references);

export const blockNodeResourceIDs = createSelector([root], ({ blockNodeResourceIDs }) => blockNodeResourceIDs);

export const triggerNodeResourceIDs = createSelector([root], ({ triggerNodeResourceIDs }) => triggerNodeResourceIDs);

export const resourceIDsByDiagramIDMap = createSelector(
  [root],
  ({ resourceIDsByDiagramIDMap }) => resourceIDsByDiagramIDMap
);

export const refererIDsByResourceIDMap = createSelector(
  [root],
  ({ refererIDsByResourceIDMap }) => refererIDsByResourceIDMap
);

export const resourceIDsByRefererIDMap = createSelector(
  [root],
  ({ resourceIDsByRefererIDMap }) => resourceIDsByRefererIDMap
);

export const referenceIDsByReferrerIDMap = createSelector(
  [root],
  ({ referenceIDsByReferrerIDMap }) => referenceIDsByReferrerIDMap
);

export const referenceIDsByResourceIDMap = createSelector(
  [root],
  ({ referenceIDsByResourceIDMap }) => referenceIDsByResourceIDMap
);

export const oneResourceByID = createSelector([normalizedResources, idParamSelector], (normalizedResources, id) =>
  id ? Normal.getOne(normalizedResources, id) : null
);

export const getOneResourceByID = createCurriedSelector(oneResourceByID);

export const allResourcesByIDs = createSelector([normalizedResources, idsParamSelector], (normalizedResources, ids) =>
  Normal.getMany(normalizedResources, ids)
);

export const getAllResourcesByIDs = createCurriedSelector(allResourcesByIDs);

export const allReferencesByIDs = createSelector(
  [normalizedReferences, idsParamSelector],
  (normalizedReferences, ids) => Normal.getMany(normalizedReferences, ids)
);

export const getAllReferencesByIDs = createCurriedSelector(allReferencesByIDs);

export const allResourceIDsByRefererID = createSelector(
  [resourceIDsByRefererIDMap, referrerIDParamSelector],
  (referenceIDsByResourceIDMap, referrerID) =>
    referrerID ? referenceIDsByResourceIDMap[referrerID] ?? DEFAULT_IDS : DEFAULT_IDS
);

export const getAllResourceIDsByRefererID = createCurriedSelector(allResourceIDsByRefererID);

export const allReferenceIDsByReferrerID = createSelector(
  [referenceIDsByReferrerIDMap, referrerIDParamSelector],
  (referenceIDsByReferrerIDMap, referrerID) =>
    referrerID ? referenceIDsByReferrerIDMap[referrerID] ?? DEFAULT_IDS : DEFAULT_IDS
);

export const getAllReferenceIDsByReferrerID = createCurriedSelector(allReferenceIDsByReferrerID);
