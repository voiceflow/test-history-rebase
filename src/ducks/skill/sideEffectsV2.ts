import { AccountLinking, AlexaVersionData, Locale } from '@voiceflow/alexa-types';
import _pick from 'lodash/pick';

import clientV2, { getPlatformService } from '@/clientV2';
import intentAdapter from '@/clientV2/adapters/intent';
import slotAdapter from '@/clientV2/adapters/slot';
import accountLinkingAdapter from '@/clientV2/adapters/version/alexa/accountLinking';
import alexaSettingsAdapter, { SkillSettings } from '@/clientV2/adapters/version/alexa/settings';
import googleSettingsAdapter from '@/clientV2/adapters/version/google/settings';
import { PlatformType } from '@/constants';
import * as Diagram from '@/ducks/diagramV2';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/productV2';
import * as Project from '@/ducks/project';
import * as Slot from '@/ducks/slot';
import * as Models from '@/models';
import { Thunk } from '@/store/types';
import { isChoiceNode, isFlowNode, isIntentNode, isProductLinkedNode } from '@/utils/node';
import { arrayStringReplace } from '@/utils/string';

import * as Meta from './meta';
import * as Skill from './skill';

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
    await clientV2.alexaService.version.updatePublishing(versionID, { invocationName, invocations });
  } else if (platform === PlatformType.GOOGLE) {
    await clientV2.googleService.version.updatePublishing(versionID, { pronunciation: invocationName, sampleInvocations: invocations });
  }
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

// TODO: REFACTOR SETTINGS INTO PLATFORM SPECIFIC CHUNKS
export const saveSettings = (settings: Partial<SkillSettings>, properties?: string[]): Thunk => async (dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state)!;
  const platform = Skill.activePlatformSelector(state)!;

  // only certain adapted properties as specified by "properties"
  if (platform === PlatformType.ALEXA) {
    const alexaSettings = alexaSettingsAdapter.toDB(settings as SkillSettings);
    await clientV2.alexaService.version.updateSettings(skillID, properties ? _pick(alexaSettings, properties) : alexaSettings);
    dispatch(Meta.updateSkillMeta(settings));
  } else if (platform === PlatformType.GOOGLE) {
    const googleSettings = googleSettingsAdapter.toDB(settings as SkillSettings);
    await clientV2.googleService.version.updateSettings(skillID, properties ? _pick(googleSettings, properties) : googleSettings);
    dispatch(Meta.updateSkillMeta(settings));
  }
};

export const saveIntentsAndSlots = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);
  const platform = Skill.activePlatformSelector(state);

  const slots = slotAdapter.mapToDB(Slot.allSlotsSelector(state));
  const intents = intentAdapter(platform).mapToDB(Intent.allIntentsSelector(state));

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

  await clientV2.alexaService.version.updateSettings(skillID, { accountLinking: accountLinking && accountLinkingAdapter.toDB(accountLinking) });

  dispatch(Meta.updateAccountLinking(accountLinking));
};

export const getAccountLinking = (): Thunk<AccountLinking | null> => async (_dispatch, getState) => {
  const state = getState();
  const skillID = Skill.activeSkillIDSelector(state);

  const {
    platformData: {
      settings: { accountLinking },
    },
  } = await clientV2.api.version.get<{ platformData: AlexaVersionData }>(skillID, ['platformData']);

  return accountLinking && accountLinkingAdapter.fromDB(accountLinking);
};

export const saveLocales = (locales: [Locale, ...Locale[]]): Thunk => async (dispatch, getState) => {
  if (locales?.length === 0) return;
  const state = getState();
  const platform = Skill.activePlatformSelector(state);
  const versionID = Skill.activeSkillIDSelector(state);

  const service = getPlatformService(platform);

  await service?.version.updatePublishing(versionID, { locales: locales as any });

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
