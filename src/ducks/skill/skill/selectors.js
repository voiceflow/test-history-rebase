import { constants } from '@voiceflow/common';
import { createSelector } from 'reselect';

import { createRootSelector } from '@/ducks/utils';

import { STATE_KEY } from './constants';

const { LOCALES } = constants.locales;

export const activeSkillSelector = createRootSelector(STATE_KEY);

export const activeSkillIDSelector = createSelector(activeSkillSelector, ({ id }) => id);

export const activeNameSelector = createSelector(activeSkillSelector, ({ name }) => name);

export const activeSkillVendorSelector = createSelector(activeSkillSelector, ({ vendor_id: vendorId }) => vendorId);

export const activePlatformSelector = createSelector(activeSkillSelector, ({ platform }) => platform);

export const activeDiagramIDSelector = createSelector(activeSkillSelector, ({ diagramID }) => diagramID);

export const rootDiagramIDSelector = createSelector(activeSkillSelector, ({ rootDiagramID }) => rootDiagramID);

export const globalVariablesSelector = createSelector(activeSkillSelector, (skill) => skill?.globalVariables || []);

export const activeProjectIDSelector = createSelector(activeSkillSelector, ({ projectID }) => projectID);

export const activeSkillCreatorIDSelector = createSelector(activeSkillSelector, ({ creatorID }) => creatorID);

export const activeLocalesSelector = createSelector(activeSkillSelector, ({ locales }) => locales);

export const activeSkillMetaSelector = createSelector(activeSkillSelector, ({ meta }) => meta);

export const parentCtrlSelector = createSelector(
  activeLocalesSelector,
  activeSkillMetaSelector,
  (locales, meta) => meta.copa && locales.includes(LOCALES.US)
);

export const isRootDiagramSelector = createSelector(activeSkillSelector, ({ diagramID, rootDiagramID }) => diagramID === rootDiagramID);
