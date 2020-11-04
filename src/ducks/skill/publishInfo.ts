import update from 'immutability-helper';
import { createSelector } from 'reselect';

import { PLATFORMS, PlatformType } from '@/constants';
import { createAction } from '@/ducks/utils';
import { Action, RootReducer } from '@/store/types';
import { Nullable } from '@/types';

import { activePlatformSelector, activeSkillSelector } from './skill';

type State = Nullable<Record<PlatformType, any>>;

enum SkillPublishInfoAction {
  UPDATE_PUBLISH_INFO = 'SKILL:UPDATE_ACTIVE_PUBLISH',
}

type UpdatePublishPlatformsAction<T extends PlatformType = PlatformType> = Action<
  SkillPublishInfoAction.UPDATE_PUBLISH_INFO,
  Partial<NonNullable<State>[T]>,
  { platform: PlatformType }
>;

export type AnyPublishInfoAction = UpdatePublishPlatformsAction;

export const updatePublishInfoReducer = (state: State, { meta, payload }: UpdatePublishPlatformsAction) =>
  update(state, { [meta.platform]: { $merge: payload } });

const publishInfoReducer: RootReducer<State, AnyPublishInfoAction> = (state = null, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case SkillPublishInfoAction.UPDATE_PUBLISH_INFO:
      return updatePublishInfoReducer(state, action);
    default:
      return state;
  }
};

export default publishInfoReducer;

// selectors

export const publishInfoSelector = createSelector(activeSkillSelector, ({ publishInfo }) => publishInfo);

export const selectedVendorSelector = createSelector(
  [publishInfoSelector, activePlatformSelector],
  (publishInfo, platform) => publishInfo?.[platform].vendorId
);

export const amazonIDSelector = createSelector(
  [publishInfoSelector, activePlatformSelector],
  (publishInfo, platform) => publishInfo?.[platform].amznID
);

const createPublishPlatformSelector = (platform: PlatformType) =>
  createSelector(activeSkillSelector, ({ publishInfo }) => publishInfo?.[platform] ?? null);

type PublishPlatformSelectors = Record<PlatformType, ReturnType<typeof createPublishPlatformSelector>>;

export const publishPlatformSelectors = PLATFORMS.reduce<PublishPlatformSelectors>(
  (selectors, platform) => Object.assign(selectors, { [platform]: createPublishPlatformSelector(platform) }),
  {} as PublishPlatformSelectors
);

// action creators

const createUpdatePublishPlatformAction = <T extends PlatformType>(platform: T) => (
  properties: Partial<NonNullable<State>[T]>,
  meta?: Record<string, unknown>
): UpdatePublishPlatformsAction<T> => createAction(SkillPublishInfoAction.UPDATE_PUBLISH_INFO, properties, { platform, ...meta });

type UpdatePublishPlatforms = Record<PlatformType, ReturnType<typeof createUpdatePublishPlatformAction>>;

export const updatePublishPlatforms = PLATFORMS.reduce<UpdatePublishPlatforms>(
  (actions, platform) => Object.assign(actions, { [platform]: createUpdatePublishPlatformAction(platform) }),
  {} as UpdatePublishPlatforms
);

export const updateAlexaPublishInfo = updatePublishPlatforms[PlatformType.ALEXA];

export const updateGooglePublishInfo = updatePublishPlatforms[PlatformType.GOOGLE];
