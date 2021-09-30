import { Project as AlexaProject } from '@voiceflow/alexa-types';
import { VersionFolderItemType } from '@voiceflow/api-sdk';
import { Constants } from '@voiceflow/general-types';
import { Adapters } from '@voiceflow/realtime-sdk';
import { Version as VoiceVersion } from '@voiceflow/voice-types';
import { batch } from 'react-redux';

import client from '@/client';
import projectAdapter, { AnyProjectData, AnyProjectMemberData, productAdapter } from '@/client/adapters/project';
import slotAdapter from '@/client/adapters/slot';
import versionAdapter, { AnyDBVersion } from '@/client/adapters/version';
import createSessionAdapter from '@/client/adapters/version/session';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Feature from '@/ducks/feature';
import * as Integration from '@/ducks/integration';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import * as Thread from '@/ducks/thread';
import * as Models from '@/models';
import { Thunk } from '@/store/types';
import { storeLogger } from '@/store/utils';
import { isChoiceNode, isFlowNode, isIntentNode, isProductLinkedNode } from '@/utils/node';
import { getDistinctPlatformValue, setDistinctPlatformValue } from '@/utils/platform';

import { addVersion, updateSessionByVersionID } from '../../actions';
import { activeDefaultVoiceSelector, activeSessionSelector } from '../../selectors';
import { AnyLocale, AnyVersion } from '../../types';
import { updateLocalesByVersionID } from '../platform';

export * from './variables';

export const loadVersionByID =
  (versionID: string): Thunk<AnyVersion> =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);

    const dbVersion = (await client.api.version.get(versionID)) as AnyDBVersion;
    const version = versionAdapter.fromDB(dbVersion, { platform });

    dispatch(addVersion(version.id, version));

    return version;
  };

export const activateVersion =
  (versionID: string, diagramID?: string): Thunk<AnyVersion> =>
  async (dispatch, getState) => {
    const state = getState();

    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    const isTopicsAndComponents = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);

    const dbVersion = await client.api.version.get<AnyDBVersion>(versionID);

    const diagrams = await dispatch(Diagram.loadDiagrams(versionID, dbVersion.rootDiagramID));

    if (isTopicsAndComponents && !dbVersion.topics?.length) {
      dbVersion.topics = [{ type: VersionFolderItemType.DIAGRAM, sourceID: dbVersion.rootDiagramID }];
      dbVersion.folders = {};
      dbVersion.components = diagrams
        .filter((diagram) => diagram.id !== dbVersion.rootDiagramID)
        .map((diagram) => ({ type: VersionFolderItemType.DIAGRAM, sourceID: diagram.id }));
    }

    // not a dependency for project to load
    dispatch(Integration.fetchIntegrationUsers()).catch(() => storeLogger.warn('Unable to fetch integration users'));

    const dbProject = await client.api.project.get<AnyProjectData, AnyProjectMemberData>(dbVersion.projectID);

    const platform = dbProject.platform as Constants.PlatformType;

    const project = projectAdapter.fromDB(dbProject);
    const version = versionAdapter.fromDB(dbVersion, { platform });
    const slots = slotAdapter.mapFromDB(dbVersion.platformData.slots);
    const intents = Adapters.getPlatformIntentAdapter<any>(platform).mapFromDB(dbVersion.platformData.intents, { platform });

    const products =
      'products' in dbProject.platformData
        ? productAdapter.mapFromDB(Object.values((dbProject.platformData as AlexaProject.AlexaProjectData).products))
        : [];

    batch(() => {
      dispatch(Creator.resetCreator());
      dispatch(Product.replaceProducts(products));
      dispatch(Intent.replaceIntents(intents));
      dispatch(Slot.replaceSlots(slots));

      if (!isAtomicActions) {
        dispatch(Project.addProject(project.id, project));
      }

      dispatch(addVersion(version.id, version));
      dispatch(
        Prototype.updatePrototypeSettings(
          {
            ...dbVersion.prototype?.settings,
            layout: (dbVersion.prototype?.settings.layout as Prototype.PrototypeLayout | undefined) ?? Prototype.PrototypeLayout.TEXT_DIALOG,
          },
          false
        )
      );
      dispatch(Thread.loadThreads(version.projectID));
      dispatch(Session.setActiveDiagramID(diagramID || version.rootDiagramID));
      dispatch(Session.setActiveProjectID(version.projectID));
      dispatch(Session.setActiveVersionID(versionID));
      dispatch(Session.setActiveWorkspaceID(dbProject.teamID));
    });

    return version;
  };

export const importProjectContext =
  ({
    nodes,
    products,
    diagrams,
    sourcePlatform,
    targetPlatform,
  }: {
    nodes: { data: Models.NodeData<unknown>; node: Models.Node }[];
    products: Models.Product[];
    diagrams: Models.Diagram[];
    sourcePlatform: Constants.PlatformType;
    targetPlatform: Constants.PlatformType;
  }): Thunk<{ data: Models.NodeData<unknown>; node: Models.Node }[]> =>
  async (dispatch) => {
    let mappedNodes = nodes;

    if (sourcePlatform !== targetPlatform) {
      mappedNodes = mappedNodes.map((node) => {
        if (isIntentNode(node.data)) {
          return {
            ...node,
            data: { ...node.data, ...setDistinctPlatformValue(targetPlatform, getDistinctPlatformValue(sourcePlatform, node.data)) },
          };
        }

        if (isChoiceNode(node.data)) {
          return {
            ...node,
            data: {
              ...node.data,
              choices: node.data.choices.map((choice) => ({
                ...choice,
                ...setDistinctPlatformValue(targetPlatform, getDistinctPlatformValue(sourcePlatform, choice)),
              })),
            },
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

// active version

export const saveIntentsAndSlots = (): Thunk => async (_, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const platform = ProjectV2.active.platformSelector(state);

  Errors.assertVersionID(versionID);

  const slots = slotAdapter.mapToDB(Slot.allSlotsSelector(state));
  const intents = Adapters.getPlatformIntentAdapter(platform).mapToDB(
    Intent.allIntentsSelector(state) as any /* TODO: find a way to fix this typing, update adapters */
  );

  await client.api.version.updatePlatformData(versionID, { slots, intents });
};

export const saveLocales =
  (locales: AnyLocale[]): Thunk =>
  async (dispatch, getState) => {
    if (!locales?.length) return;

    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await client.platform(platform).version.updatePublishing(versionID, { locales: locales as any });

    dispatch(updateLocalesByVersionID(versionID, locales));
  };

export const saveSession =
  (session: Partial<Models.Version.Session>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const activeSession = activeSessionSelector(state);
    const defaultVoice = activeDefaultVoiceSelector(state);
    const platform = ProjectV2.active.platformSelector(state);

    if (!versionID || !activeSession) throw Errors.noActiveVersionID();

    dispatch(updateSessionByVersionID(versionID, session));

    await client.platform(platform).version.updateSettings(versionID, {
      session: createSessionAdapter({ platform }).toDB(
        { ...activeSession, ...session },
        { defaultVoice }
      ) as VoiceVersion.VoiceVersionSettings<any>['session'],
    });
  };

export const saveResumePrompt =
  (resumePrompt: Partial<Models.Version.Session['resumePrompt']>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeSession = activeSessionSelector(state);

    if (!activeSession) throw Errors.noActiveVersionID();

    await dispatch(
      saveSession({
        resumePrompt: {
          ...activeSession.resumePrompt,
          ...resumePrompt,
        },
      })
    );
  };
