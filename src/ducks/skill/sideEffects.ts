import { AccountLinking, AlexaVersionData, Locale } from '@voiceflow/alexa-types';
import { Locale as GoogleLocale } from '@voiceflow/google-types';
import fileSaver from 'file-saver';
import _pick from 'lodash/pick';

import client from '@/client';
import intentAdapter from '@/client/adapters/intent';
import slotAdapter from '@/client/adapters/slot';
import accountLinkingAdapter from '@/client/adapters/version/alexa/accountLinking';
import alexaSettingsAdapter, { SkillSettings } from '@/client/adapters/version/alexa/settings';
import googleSettingsAdapter from '@/client/adapters/version/google/settings';
import { toast } from '@/components/Toast';
import { ExportFormat, PlatformType, VALID_VARIABLE_NAME } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import * as Models from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { getAuthCookie } from '@/utils/cookies';
import { DataTypes, download } from '@/utils/dom';
import { isChoiceNode, isFlowNode, isIntentNode, isProductLinkedNode } from '@/utils/node';
import { arrayStringReplace } from '@/utils/string';

import * as Meta from './meta';
import * as Skill from './skill';

export const addGlobalVariable = (variable: string | null): SyncThunk => (dispatch, getState) => {
  if (variable) {
    const variables = Skill.globalVariablesSelector(getState());

    if (!variable.match(VALID_VARIABLE_NAME)) {
      throw new Error('Variable contains invalid characters or is greater than 16 characters');
    } else if (variables.includes(variable)) {
      throw new Error(`No duplicate variables: ${variable}`);
    }

    dispatch(Skill.addGlobalVariableAC(variable));
  }
};

export const exportCanvas = (type: ExportFormat): Thunk => async (dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  dispatch(Skill.setExportingCanvas(true));

  if (type === ExportFormat.VF) {
    const name = Skill.activeNameSelector(state);
    try {
      const data = await client.api.version.export(skillID);
      download(`${name.replace(/ /g, '_')}-${skillID}.vf`, JSON.stringify(data, null, 2), DataTypes.JSON);
    } catch (error) {
      console.error(error);
      toast.error('.VF export failed');
    }
    dispatch(Skill.setExportingCanvas(false));
    return;
  }

  const options = {
    token: getAuthCookie()!,
    canvasURL: `https://${window.location.host}/project/${skillID}/export/${diagramID}`,
    persistedTabID: Session.tabIDPersistor.getRaw()!,
    persistedBrowserID: Session.browserIDPersistor.getRaw()!,
  };

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

  dispatch(Skill.setExportingCanvas(false));
};

export const saveInvocationName = (invocationName: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const platform = Skill.activePlatformSelector(state);

  const meta = Meta.skillMetaSelector(state);
  if (meta.invName === invocationName) return;

  // update all the invocation examples when invocation name changes
  const invocations = arrayStringReplace(meta.invName, invocationName, meta.invocations);

  dispatch(Meta.updateSkillMeta({ invName: invocationName, invocations }));

  if (platform === PlatformType.ALEXA) {
    await client.platform.alexa.version.updatePublishing(versionID, { invocationName, invocations });
  } else if (platform === PlatformType.GOOGLE) {
    await client.platform.google.version.updatePublishing(versionID, { pronunciation: invocationName, sampleInvocations: invocations });
  }
};

export const saveProjectName = (name: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const projectID = Skill.activeProjectIDSelector(state);
  if (name === Skill.activeNameSelector(state)) return;

  await client.api.project.update(projectID, { name });

  // the frontend seems to derive the name from the skill (version) name, update it for now.
  dispatch(Skill.updateActiveSkill({ name }));
  dispatch(Project.updateProjectName(projectID, name));
};

// TODO: REFACTOR SETTINGS INTO PLATFORM SPECIFIC CHUNKS
export const saveSettings = (settings: Partial<SkillSettings>, properties?: string[]): Thunk => async (dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state)!;
  const platform = Skill.activePlatformSelector(state)!;

  // only certain adapted properties as specified by "properties"
  if (platform === PlatformType.ALEXA) {
    const alexaSettings = alexaSettingsAdapter.toDB(settings as SkillSettings);
    await client.platform.alexa.version.updateSettings(skillID, properties ? _pick(alexaSettings, properties) : alexaSettings);
    dispatch(Meta.updateSkillMeta(settings));
  } else if (platform === PlatformType.GOOGLE) {
    const googleSettings = googleSettingsAdapter.toDB(settings as SkillSettings);
    await client.platform.google.version.updateSettings(skillID, properties ? _pick(googleSettings, properties) : googleSettings);
    dispatch(Meta.updateSkillMeta(settings));
  }
};

export const saveIntentsAndSlots = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);
  const platform = Skill.activePlatformSelector(state);

  const slots = slotAdapter.mapToDB(Slot.allSlotsSelector(state));
  const intents = intentAdapter(platform).mapToDB(Intent.allIntentsSelector(state));

  await client.api.version.updatePlatformData<AlexaVersionData>(skillID, { slots, intents });
};

export const saveVariables = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);
  const global = Skill.globalVariablesSelector(state);

  await client.api.version.update(skillID, { variables: global });
};

export const saveAccountLinking = (accountLinking: null | AccountLinking): Thunk => async (dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);

  await client.platform.alexa.version.updateSettings(skillID, { accountLinking: accountLinking && accountLinkingAdapter.toDB(accountLinking) });

  dispatch(Meta.updateAccountLinking(accountLinking));
};

export const getAccountLinking = (): Thunk<AccountLinking | null> => async (_dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);

  const {
    platformData: {
      settings: { accountLinking },
    },
  } = await client.api.version.get<{ platformData: AlexaVersionData }>(skillID, ['platformData']);

  return accountLinking && accountLinkingAdapter.fromDB(accountLinking);
};

export const saveLocales = (locales: Locale[] | GoogleLocale[]): Thunk => async (dispatch, getState) => {
  if (locales?.length === 0) return;
  const state = getState();
  const platform = Skill.activePlatformSelector(state);
  const versionID = Skill.activeSkillIDSelector(state);

  await client.platform(platform)?.version.updatePublishing(versionID, { locales: locales as any });

  dispatch(Skill.updateActiveSkill({ locales }));
};

export const handlePastedNodes = ({
  nodes,
  products,
  diagrams,
  sourcePlatform,
  targetPlatform,
}: {
  nodes: { data: Models.NodeData<unknown>; node: Models.Node }[];
  products: Models.Product[];
  diagrams: Models.Diagram[];
  sourcePlatform: PlatformType;
  targetPlatform: PlatformType;
}): Thunk<{ data: Models.NodeData<unknown>; node: Models.Node }[]> => async (dispatch) => {
  let mappedNodes = nodes;

  if (sourcePlatform !== targetPlatform) {
    mappedNodes = mappedNodes.map((node) => {
      if (isIntentNode(node.data)) {
        return { ...node, data: { ...node.data, [targetPlatform]: node.data[sourcePlatform] } };
      }

      if (isChoiceNode(node.data)) {
        return {
          ...node,
          data: { ...node.data, choices: node.data.choices.map((choice) => ({ ...choice, [targetPlatform]: choice[sourcePlatform] })) },
        };
      }

      return node;
    });
  }

  await Promise.all(
    products.map(async (product) => {
      const newProductID = await dispatch(Product.copyNewProduct(product));

      mappedNodes = mappedNodes.map((node) =>
        isProductLinkedNode(node.data) && node.data.productID === product.id ? { ...node, data: { ...node.data, productID: newProductID } } : node
      );
    })
  );

  await Promise.all(
    diagrams.map(async (diagram) => {
      const newDiagramID = await dispatch(Diagram.copyDiagram(diagram.id));

      mappedNodes = mappedNodes.map((node) =>
        isFlowNode(node.data) && node.data.diagramID === diagram.id ? { ...node, data: { ...node.data, diagramID: newDiagramID } } : node
      );
    })
  );

  return mappedNodes;
};
