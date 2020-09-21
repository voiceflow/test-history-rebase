import { AccountLinking, AlexaVersionData, Locale } from '@voiceflow/alexa-types';
import _pick from 'lodash/pick';

import clientV2, { getPlatformService } from '@/clientV2';
import { alexaIntentAdapter } from '@/clientV2/adapters/intent';
import slotAdapter from '@/clientV2/adapters/slot';
import alexaSettingsAdapter, { SkillSettings } from '@/clientV2/adapters/version/alexa/settings';
import * as Intent from '@/ducks/intent';
import * as Project from '@/ducks/project';
import * as Slot from '@/ducks/slot';
import { Thunk } from '@/store/types';
import { arrayStringReplace } from '@/utils/string';

import * as Meta from './meta';
import * as Skill from './skill';

export const saveInvocationName = (invocationName: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);

  const meta = Meta.skillMetaSelector(state);
  if (meta.invName === invocationName) return;

  // update all the invocation examples when invocation name changes
  const invocations = arrayStringReplace(meta.invName, invocationName, meta.invocations);

  dispatch(Meta.updateSkillMeta({ invName: invocationName, invocations }));
  await clientV2.alexaService.updateVersionPublishing(versionID, { invocationName, invocations });
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
  await clientV2.alexaService.updateVersionSettings(skillID, properties ? _pick(alexaSettings, properties) : alexaSettings);
  dispatch(Meta.updateSkillMeta(settings));
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

export const saveAccountLinking = (accountLinking: null | AccountLinking): Thunk => async (dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);

  await clientV2.alexaService.updateVersionSettings(skillID, { accountLinking });

  dispatch(Meta.updateAccountLinking(accountLinking));
};

export const getAccountLinking = (): Thunk<AccountLinking | null> => async (_dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);

  const { platformData } = await clientV2.api.version.get<{ platformData: AlexaVersionData }>(skillID, ['platformData']);

  return platformData.settings.accountLinking;
};

export const saveLocales = (locales: [Locale, ...Locale[]]): Thunk => async (dispatch, getState) => {
  if (locales.length === 0) return;
  const state = getState();
  const platform = Skill.activePlatformSelector(state);
  const versionID = Skill.activeSkillIDSelector(state);

  const service = getPlatformService(platform);
  await service?.updateVersionPublishing(versionID, { locales });
  dispatch(Skill.updateActiveSkill({ locales }));
};
