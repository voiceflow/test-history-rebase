import { Reducer, RootReducer } from '@/store/types';

import { SkillState } from '../types';
import { AnySkillMetaAction, SkillMetaAction, UpdateSettingsAction, UpdateSkillMetaAction } from './actions';

export * from './actions';
export * from './selectors';

export const updateSkillMetaReducer: Reducer<SkillState<string>['meta'], UpdateSkillMetaAction> = (state, { payload }) => ({
  ...state,
  ...payload,
});

export const updateSkillMetaSettingsReducer: Reducer<SkillState<string>['meta'], UpdateSettingsAction> = (state, { payload }) => ({
  ...state,
  settings: { ...state.settings, ...payload },
});

const skillMetaReducer: RootReducer<SkillState<string>['meta'], AnySkillMetaAction> = (state = {} as any, action) => {
  switch (action.type) {
    case SkillMetaAction.UPDATE_SKILL_META_SETTINGS:
      return updateSkillMetaSettingsReducer(state, action);
    case SkillMetaAction.UPDATE_SKILL_META:
      return updateSkillMetaReducer(state, action);
    default:
      return state;
  }
};

export default skillMetaReducer;
