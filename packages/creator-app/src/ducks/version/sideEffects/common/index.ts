import { AlexaProject } from '@voiceflow/alexa-types';
import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { batch } from 'react-redux';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { getDefaultPrototypeLayout, PrototypeLayout } from '@/constants/prototype';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Feature from '@/ducks/feature';
import * as Integration from '@/ducks/integration';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import * as Thread from '@/ducks/thread';
import * as VersionV2 from '@/ducks/versionV2';
import { Thunk } from '@/store/types';
import { storeLogger } from '@/store/utils';
import { getDistinctPlatformValue, setDistinctPlatformValue } from '@/utils/platform';

import { crud, updateSessionByVersionID } from '../../actions';
import { getActiveVersionContext } from '../../utils';

export * from './topicsComponents';
export * from './variables';

/**
 * @deprecated these are now loaded automatically by the subscription to the project/:projectID realtime event channel
 */
export const loadVersionByID =
  (versionID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) return;

    const dbVersion = (await client.api.version.get(versionID)) as Realtime.AnyDBVersion;
    const version = Realtime.Adapters.versionAdapter.fromDB(dbVersion, { platform });

    dispatch(crud.add(version.id, version));
  };

/**
 * @deprecated
 */
export const activateVersion =
  (versionID: string, diagramID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    const isTopicsAndComponentsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);
    const isTopicsAndComponentsVersion = ProjectV2.active.isTopicsAndComponentsVersionSelector(state);

    if (isAtomicActions) return;

    const dbVersion = await client.api.version.get<Realtime.AnyDBVersion>(versionID);
    const { projectID, rootDiagramID } = dbVersion;

    const diagrams = await dispatch(Diagram.loadDiagrams(versionID, rootDiagramID));

    if (isTopicsAndComponentsEnabled && isTopicsAndComponentsVersion && !dbVersion.topics?.length) {
      dbVersion.topics = [{ type: BaseModels.Version.FolderItemType.DIAGRAM, sourceID: rootDiagramID }];
    }

    if (isTopicsAndComponentsEnabled && isTopicsAndComponentsVersion && !dbVersion.components?.length) {
      dbVersion.folders = { ...dbVersion.folders };
      dbVersion.components = diagrams
        .filter((diagram) => diagram.id !== rootDiagramID && (!diagram.type || diagram.type === BaseModels.Diagram.DiagramType.COMPONENT))
        .map((diagram) => ({ type: BaseModels.Version.FolderItemType.DIAGRAM, sourceID: diagram.id }));
    }

    // not a dependency for project to load
    dispatch(Integration.fetchIntegrationUsers()).catch(() => storeLogger.warn('Unable to fetch integration users'));

    const project = await client.api.project
      .get<Realtime.AnyProjectData, Realtime.AnyProjectMemberData>(projectID)
      .then(Realtime.Adapters.projectAdapter.fromDB);
    const { platform, workspaceID, platformData: projectPlatformData } = project;

    const version = Realtime.Adapters.versionAdapter.fromDB(dbVersion, { platform });
    const slots = Realtime.Adapters.slotAdapter.mapFromDB(dbVersion.platformData.slots);
    const intents = Realtime.Adapters.getPlatformIntentAdapter<any>(platform).mapFromDB(dbVersion.platformData.intents, { platform });

    const products =
      'products' in projectPlatformData
        ? Realtime.Adapters.productAdapter.mapFromDB(Object.values((projectPlatformData as AlexaProject.PlatformData).products))
        : [];

    batch(() => {
      dispatch(Creator.resetCreator());
      dispatch(Product.replaceProducts(products));
      dispatch(Intent.replaceIntents(intents));
      dispatch(Slot.crud.replace(slots));
      dispatch(Project.crud.add(projectID, project));
      dispatch(crud.add(versionID, version));
      dispatch(
        Prototype.updatePrototypeSettings(
          {
            ...dbVersion.prototype?.settings,
            layout: (dbVersion.prototype?.settings.layout ?? getDefaultPrototypeLayout(platform)) as PrototypeLayout,
          },
          false
        )
      );
      dispatch(Thread.loadThreads(projectID));
      dispatch(Session.setActiveDiagramID(diagramID || version.rootDiagramID));
      dispatch(Session.setActiveProjectID(projectID));
      dispatch(Session.setActiveVersionID(versionID));
      dispatch(Session.setActiveWorkspaceID(workspaceID));
    });

    await client.socket?.project.initialize(projectID);
  };

export const activateVersionV2 =
  ({ workspaceID, projectID, versionID, diagramID, platform }: Realtime.version.ActivateVersionPayload): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (!isAtomicActions) return;

    const dbVersion = await client.api.version.get<Realtime.AnyDBVersion>(versionID);

    // not a dependency for project to load
    dispatch(Integration.fetchIntegrationUsers()).catch(() => storeLogger.warn('Unable to fetch integration users'));

    batch(() => {
      dispatch(Creator.resetCreator());
      dispatch(
        Prototype.updatePrototypeSettings(
          {
            ...dbVersion.prototype?.settings,
            layout: (dbVersion.prototype?.settings.layout ?? getDefaultPrototypeLayout(platform)) as PrototypeLayout,
          },
          false
        )
      );
      dispatch(Thread.loadThreads(projectID));
      dispatch(Session.setActiveDiagramID(diagramID));
      dispatch(Session.setActiveProjectID(projectID));
      dispatch(Session.setActiveVersionID(versionID));
      dispatch(Session.setActiveWorkspaceID(workspaceID));
    });

    await client.socket?.project.initialize(projectID);
  };

export const importProjectContext =
  ({
    nodes,
    products,
    diagrams,
    sourcePlatform,
    targetPlatform,
  }: {
    nodes: { data: Realtime.NodeData<unknown>; node: Realtime.Node }[];
    products: Realtime.Product[];
    diagrams: Realtime.Diagram[];
    sourcePlatform: VoiceflowConstants.PlatformType;
    targetPlatform: VoiceflowConstants.PlatformType;
  }): Thunk<{ data: Realtime.NodeData<unknown>; node: Realtime.Node }[]> =>
  async (dispatch) => {
    let mappedNodes = nodes;

    if (sourcePlatform !== targetPlatform) {
      mappedNodes = mappedNodes.map((node) => {
        if (Realtime.Utils.node.isIntentNode(node.data)) {
          return {
            ...node,
            data: { ...node.data, ...setDistinctPlatformValue(targetPlatform, getDistinctPlatformValue(sourcePlatform, node.data)) },
          };
        }

        if (Realtime.Utils.node.isChoiceNode(node.data)) {
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
        const newProductID = await dispatch(Product.cloneProduct(product));

        mappedNodes = mappedNodes.map((node) =>
          Realtime.Utils.node.isProductLinkedNode(node.data) && node.data.productID === product.id
            ? { ...node, data: { ...node.data, productID: newProductID } }
            : node
        );
      })
    );

    await Promise.all(
      diagrams.map(async (diagram) => {
        const newDiagramID = await dispatch(Diagram.duplicateDiagram(diagram.id));

        mappedNodes = mappedNodes.map((node) =>
          Realtime.Utils.node.isDiagramNode(node.data) && node.data.diagramID === diagram.id
            ? { ...node, data: { ...node.data, diagramID: newDiagramID } }
            : node
        );
      })
    );

    return mappedNodes;
  };

// active version

/**
 * @deprecated intent and slot changes are synchronized by the new realtime system
 */
export const saveIntentsAndSlots = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const platform = ProjectV2.active.platformSelector(state);
  const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

  if (isAtomicActions) return;

  Errors.assertVersionID(versionID);

  const slots = Realtime.Adapters.slotAdapter.mapToDB(SlotV2.allSlotsSelector(state));
  const intents = Realtime.Adapters.getPlatformIntentAdapter(platform).mapToDB(
    IntentV2.allIntentsSelector(state) as any /* TODO: find a way to fix this typing, update adapters */
  );

  await client.api.version.updatePlatformData(versionID, { slots, intents });
};

export const patchSession =
  (session: Partial<Realtime.Version.Session>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const activeSession = VersionV2.active.sessionSelector(state);
    const defaultVoice = VersionV2.active.defaultVoiceSelector(state);
    const platform = ProjectV2.active.platformSelector(state);

    if (!versionID || !activeSession) throw Errors.noActiveVersionID();

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const dbSession = Realtime.Adapters.createSessionAdapter({ platform }).toDB({ ...activeSession, ...session }, { defaultVoice }) as any;

          dispatch(updateSessionByVersionID(versionID, session));

          await client.platform(platform).version.updateSettings(versionID, { session: dbSession });
        },
        async (context) => {
          await dispatch.sync(Realtime.version.patchSession({ ...context, session }));
        }
      )
    );
  };

export const updateResumePrompt =
  (resumePrompt: Partial<Realtime.Version.Session['resumePrompt']>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeSession = VersionV2.active.sessionSelector(state);

    if (!activeSession) throw Errors.noActiveVersionID();

    await dispatch(
      patchSession({
        resumePrompt: {
          ...activeSession.resumePrompt,
          ...resumePrompt,
        },
      })
    );
  };
