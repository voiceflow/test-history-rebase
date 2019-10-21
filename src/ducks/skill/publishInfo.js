import update from 'immutability-helper';
import { createSelector } from 'reselect';

import { PLATFORMS } from '@/constants';
import { createAction } from '@/ducks/utils';

import { activeSkillSelector } from './skill';

export const UPDATE_PUBLISH_INFO = 'SKILL:UPDATE_ACTIVE_PUBLISH';

export const updatePublishInfoReducer = (state, { context: platform, payload }) => update(state, { [platform]: { $merge: payload } });

function publishInfoReducer(state = null, action) {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case UPDATE_PUBLISH_INFO:
      return updatePublishInfoReducer(state, action);
    default:
      return state;
  }
}

export default publishInfoReducer;

// selectors

export const publishInfoSelector = createSelector(
  activeSkillSelector,
  ({ publishInfo }) => publishInfo
);

export const publishPlatformSelectors = PLATFORMS.reduce((selectors, platform) => {
  selectors[platform] = createSelector(
    activeSkillSelector,
    ({ publishInfo }) => publishInfo[platform]
  );
  return selectors;
}, {});

// action creators

export const updatePublishPlatforms = PLATFORMS.reduce((actions, platform) => {
  actions[platform] = (properties) => createAction(UPDATE_PUBLISH_INFO, { ...properties }, platform);
  return actions;
}, {});
