import { Utils } from '@voiceflow/common';
import { SystemVariable } from '@voiceflow/dtos';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import { isFeatureEnabledSelector } from '@/ducks/feature/selectors';

import { createByFolderIDSelectors, createDesignerCRUDSelectors, createDesignerSelector } from '../utils/selector.util';
import { STATE_KEY } from './variable.state';

export const root = createSelector([createDesignerSelector(STATE_KEY), isFeatureEnabledSelector], (rootState, isFeatureEnabled) =>
  isFeatureEnabled(FeatureFlag.VF_CHUNKS_VARIABLE)
    ? rootState
    : {
        ...rootState,
        byKey: Utils.object.omit(rootState.byKey, [SystemVariable.VF_CHUNKS]),
        allKeys: Utils.array.withoutValue(rootState.allKeys, SystemVariable.VF_CHUNKS),
      }
);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const mapByName = createSelector(all, (variables) => Object.fromEntries(variables.map((variable) => [variable.name, variable])));

export const { allByFolderID, allByFolderIDs, countByFolderID } = createByFolderIDSelectors(all);

export const names = createSelector([all], (variables) => variables.map((variable) => variable.name));
