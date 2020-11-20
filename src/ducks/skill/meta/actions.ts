import { createAction } from '@/ducks/utils';
import { FullSkill } from '@/models';
import { Action } from '@/store/types';

// actions

export enum SkillMetaAction {
  UPDATE_SKILL_META = 'SKILL:META:UPDATE',
  UPDATE_SKILL_META_SETTINGS = 'SKILL:META:SETTINGS:UPDATE',
}

// action types

export type UpdateSkillMetaAction = Action<SkillMetaAction.UPDATE_SKILL_META, Partial<FullSkill<string>['meta']>, object | undefined>;

export type UpdateSettingsAction = Action<SkillMetaAction.UPDATE_SKILL_META_SETTINGS, Partial<FullSkill<string>['meta']['settings']>>;

export type AnySkillMetaAction = UpdateSkillMetaAction | UpdateSettingsAction;

// action creators

export const updateSkillMeta = (payload: Partial<FullSkill<string>['meta']>, meta?: object): UpdateSkillMetaAction =>
  createAction(SkillMetaAction.UPDATE_SKILL_META, payload, meta);

export const updateSettings = (payload: Partial<FullSkill<string>['meta']['settings']>): UpdateSettingsAction =>
  createAction(SkillMetaAction.UPDATE_SKILL_META_SETTINGS, payload);

export const updateAccountLinking = (accountLinking: FullSkill<string>['meta']['accountLinking']) => updateSkillMeta({ accountLinking });
