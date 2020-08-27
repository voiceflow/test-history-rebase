import { AlexaVersionData } from '@voiceflow/alexa-types';
import _pick from 'lodash/pick';

import clientV2 from '@/clientV2';
import { alexaIntentAdapter } from '@/clientV2/adapters/intent';
import slotAdapter from '@/clientV2/adapters/slot';
import alexaSettingsAdapter, { SkillSettings } from '@/clientV2/adapters/version/alexa/settings';
import * as Intent from '@/ducks/intent';
import * as Project from '@/ducks/project';
import * as Slot from '@/ducks/slot';
import { Thunk } from '@/store/types';
import { arrayStringReplace } from '@/utils/string';

import { skillMetaSelector, updateSkillMeta } from './meta';
import * as Skill from './skill';

export const saveInvocationName = (invocationName: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);

  const meta = skillMetaSelector(state);
  if (meta.invName === invocationName) return;

  // update all the invocation examples when invocation name changes
  const invocations = arrayStringReplace(meta.invName, invocationName, meta.invocations);

  dispatch(updateSkillMeta({ invName: invocationName, invocations }));
  await clientV2.alexaService.updatePublishing(versionID, { invocationName, invocations });
};

export const saveProjectName = (name: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Skill.activeProjectIDSelector(state);
  if (name === Skill.activeNameSelector(state)) return;

  await clientV2.api.project.update(projectID, { name });

  // the frontend seems to derive the name from the skill (version) name, update it for now.
  dispatch(Skill.updateActiveSkill({ name }));
  dispatch(Project.updateProjectName(projectID, name));
};

export const saveAlexaSettings = (settings: Partial<SkillSettings>, properties?: string[]): Thunk => async (dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state)!;

  // only certain adapted properties as specified by "properties"
  const alexaSettings = alexaSettingsAdapter.toDB(settings as SkillSettings);
  await clientV2.alexaService.updateSettings(skillID, properties ? _pick(alexaSettings, properties) : alexaSettings);
  dispatch(updateSkillMeta(settings));
};

export const saveIntentsAndSlots = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);

  const slots = slotAdapter.mapToDB(Slot.allSlotsSelector(state));
  const intents = alexaIntentAdapter.mapToDB(Intent.allIntentsSelector(state));

  await clientV2.api.version.updatePlatformData<AlexaVersionData>(skillID, { slots, intents });
};

export const saveVariables = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);
  const global = Skill.globalVariablesSelector(state);

  await clientV2.api.version.update(skillID, { variables: global });
};
