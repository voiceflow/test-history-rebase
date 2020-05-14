import fileSaver from 'file-saver';

import client from '@/client';
import intentAdapter from '@/client/adapters/intent';
import skillMetaAdapter from '@/client/adapters/skill/meta';
import slotAdapter from '@/client/adapters/slot';
import { toast } from '@/components/Toast';
import { ExportFormat, VALID_VARIABLE_NAME } from '@/constants';
import { allIntentsSelector } from '@/ducks/intent/selectors';
import { allSlotsSelector } from '@/ducks/slot';
import { SyncThunk, Thunk } from '@/store/types';
import { getAuthCookie, getByName } from '@/utils/cookies';

import { updateSkillMeta } from './meta';
import {
  activeDiagramIDSelector,
  activePlatformSelector,
  activeSkillIDSelector,
  addGlobalVariableAC,
  globalVariablesSelector,
  setExportingCanvas,
  updateActiveSkill,
} from './skill';

// eslint-disable-next-line import/prefer-default-export
export const saveSkillSettings = <T extends { name: string }>(settings: T): Thunk => async (dispatch, getState) => {
  const { name, ...meta } = settings;
  const state = getState();
  const skillID = activeSkillIDSelector(state)!;

  await client.skill.update(skillID, skillMetaAdapter.toDB(settings));
  dispatch(updateActiveSkill({ name }));
  dispatch(updateSkillMeta(meta));
};

export const addGlobalVariable = (variable: string | null): SyncThunk => (dispatch, getState) => {
  if (variable) {
    const variables = globalVariablesSelector(getState());

    if (!variable.match(VALID_VARIABLE_NAME)) {
      throw new Error('Variable contains invalid characters or is greater than 16 characters');
    } else if (variables.includes(variable)) {
      throw new Error(`No duplicate variables: ${variable}`);
    }

    dispatch(addGlobalVariableAC(variable));
  }
};

export const saveIntents = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);

  const intents = JSON.stringify(intentAdapter.mapToDB(allIntentsSelector(state)));
  const slots = JSON.stringify(slotAdapter.mapToDB(allSlotsSelector(state)));

  await client.skill.update(skillID, { slots, intents });
};

export const savePlatform = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);
  const platform = activePlatformSelector(state);

  await client.skill.update(skillID, { platform });
};

export const saveVariables = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);
  const global = globalVariablesSelector(state);

  await client.skill.update(skillID, { global });
};

export const exportCanvas = (type: ExportFormat): Thunk => async (dispatch, getState) => {
  const state = getState();
  const skillID = activeSkillIDSelector(state);
  const diagramID = activeDiagramIDSelector(state);

  const options = {
    token: getAuthCookie()!,
    canvasURL: `https://${window.location.host}/project/${skillID}/export/${diagramID}`,
    persistedToken: getByName('persist%3Asession%3Atoken', { doNotParse: true })!,
    persistedTabID: sessionStorage.getItem('persist:session:tab_id')!,
    persistedBrowserID: localStorage.getItem('persist:session:browser_id')!,
  };

  dispatch(setExportingCanvas(true));

  try {
    let result: Blob;

    if (type === ExportFormat.PDF) {
      result = await client.canvasExport.toPDF(options);
    } else if (type === ExportFormat.PNG) {
      result = await client.canvasExport.toPNG(options);
    } else {
      throw new Error('Unknown export type');
    }

    fileSaver.saveAs(result, `voiceflow-export-${Date.now()}.${type}`);
  } catch {
    toast.error('Something went wrong - please try a bit later');
  }

  dispatch(setExportingCanvas(false));
};
