import { Utils } from '@voiceflow/common';
import { createSelector } from 'reselect';

import { createCurriedSelector, referrerIDParamSelector } from '@/ducks/utils';
import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { createDesignerSelector } from '../../utils/selector.util';
import { STATE_KEY } from '../reference.state';

const DEFAULT_IDS: string[] = [];

export const root = createDesignerSelector(STATE_KEY);

export const resourceMap = createSelector([root], ({ resourceMap }) => resourceMap);

export const referenceMap = createSelector([root], ({ referenceMap }) => referenceMap);

export const blockNodeResourceIDs = createSelector([root], ({ blockNodeResourceIDs }) => blockNodeResourceIDs);

export const triggerNodeResourceIDs = createSelector([root], ({ triggerNodeResourceIDs }) => triggerNodeResourceIDs);

export const intentIDResourceIDMap = createSelector([root], ({ intentIDResourceIDMap }) => intentIDResourceIDMap);

export const messageIDResourceIDMap = createSelector([root], ({ messageIDResourceIDMap }) => messageIDResourceIDMap);

export const diagramIDResourceIDMap = createSelector([root], ({ diagramIDResourceIDMap }) => diagramIDResourceIDMap);

export const functionIDResourceIDMap = createSelector([root], ({ functionIDResourceIDMap }) => functionIDResourceIDMap);

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

export const globalTriggerNodeIDsByIntentIDMapByDiagramIDMap = createSelector(
  [root],
  ({ globalTriggerNodeIDsByIntentIDMapByDiagramIDMap }) => globalTriggerNodeIDsByIntentIDMapByDiagramIDMap
);

export const oneResourceByID = createSelector([resourceMap, idParamSelector], (resourceMap, id) =>
  id ? resourceMap[id] ?? null : null
);

export const getOneResourceByID = createCurriedSelector(oneResourceByID);

export const allResourcesByIDs = createSelector([resourceMap, idsParamSelector], (resourceMap, ids) =>
  ids.map((id) => resourceMap[id]).filter(Utils.array.isNotNullish)
);

export const getAllResourcesByIDs = createCurriedSelector(allResourcesByIDs);

export const allReferencesByIDs = createSelector([referenceMap, idsParamSelector], (referenceMap, ids) =>
  ids.map((id) => referenceMap[id]).filter(Utils.array.isNotNullish)
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
