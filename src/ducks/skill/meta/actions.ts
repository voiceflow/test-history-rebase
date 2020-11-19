import { createAction } from '@/ducks/utils';
import { FullSkill } from '@/models';
import { Action } from '@/store/types';

// actions

export enum SkillMetaAction {
  UPDATE_SKILL_META = 'SKILL:META:UPDATE',
  UPDATE_SKILL_META_SETTINGS = 'SKILL:META:SETTINGS:UPDATE',
}

// action types

export type UpdateSkillMetaAction = Action<SkillMetaAction.UPDATE_SKILL_META, Partial<FullSkill['meta']>, object | undefined>;

export type UpdateSettingsAction = Action<SkillMetaAction.UPDATE_SKILL_META_SETTINGS, Partial<FullSkill['meta']['settings']>>;

export type AnySkillMetaAction = UpdateSkillMetaAction | UpdateSettingsAction;

// action creators

export const updateSkillMeta = (payload: Partial<FullSkill['meta']>, meta?: object): UpdateSkillMetaAction =>
  createAction(SkillMetaAction.UPDATE_SKILL_META, payload, meta);

export const updateSettings = (payload: Partial<FullSkill['meta']['settings']>): UpdateSettingsAction =>
  createAction(SkillMetaAction.UPDATE_SKILL_META_SETTINGS, payload);

export const updateAccountLinking = (accountLinking: FullSkill['meta']['accountLinking']) => updateSkillMeta({ accountLinking });
