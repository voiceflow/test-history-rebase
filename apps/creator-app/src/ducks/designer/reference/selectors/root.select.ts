import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { createCurriedSelector } from '@/ducks/utils';
import { idsParamSelector } from '@/ducks/utils/crudV2';

import { createDesignerSelector } from '../../utils/selector.util';
import { STATE_KEY } from '../reference.state';

export const root = createDesignerSelector(STATE_KEY);

export const normalizedResources = createSelector([root], ({ resources }) => resources);

export const normalizedReferences = createSelector([root], ({ references }) => references);

export const blockNodeResourceIDs = createSelector([root], ({ blockNodeResourceIDs }) => blockNodeResourceIDs);

export const triggerNodeResourceIDs = createSelector([root], ({ triggerNodeResourceIDs }) => triggerNodeResourceIDs);

export const resourceIDsByDiagramID = createSelector([root], ({ resourceIDsByDiagramID }) => resourceIDsByDiagramID);

export const refererIDsByResourceID = createSelector([root], ({ refererIDsByResourceID }) => refererIDsByResourceID);

export const resourceIDsByRefererID = createSelector([root], ({ resourceIDsByRefererID }) => resourceIDsByRefererID);

export const resourcesByIDs = createSelector([normalizedResources, idsParamSelector], (normalizedResources, ids) =>
  Normal.getMany(normalizedResources, ids)
);

export const getResourcesByIDs = createCurriedSelector(resourcesByIDs);
