import { AlexaProjectData, AlexaVersionData } from '@voiceflow/alexa-types';
import { BaseVersionSettings } from '@voiceflow/general-types';
import { PlatformType } from '@voiceflow/internal';
import { batch } from 'react-redux';

import client from '@/client';
import intentAdapter from '@/client/adapters/intent';
import projectAdapter, { AnyProjectData, AnyProjectMemberData, productAdapter } from '@/client/adapters/project';
import slotAdapter from '@/client/adapters/slot';
import versionAdapter, { AnyDBVersion } from '@/client/adapters/version';
import createSessionAdapter from '@/client/adapters/version/session';
import * as Errors from '@/config/errors';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Integration from '@/ducks/integration';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
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
    const platform = Project.activePlatformSelector(state);

    const dbVersion = (await client.api.version.get(versionID)) as AnyDBVersion;
    const version = versionAdapter.fromDB(dbVersion, { platform });

    dispatch(addVersion(version.id, version));

    return version;
  };

export const activateVersion =
  (versionID: string, diagramID?: string): Thunk<AnyVersion> =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = Project.activePlatformSelector(state);

    const [dbVersion] = await Promise.all([
      client.api.version.get(versionID) as Promise<AnyDBVersion>,
      dispatch(Diagram.loadDiagrams(versionID)),
    ] as const);

    // not a dependency for project to load
    dispatch(Integration.fetchIntegrationUsers()).catch(() => storeLogger.warn('Unable to fetch integration users'));

    const dbProject = await client.api.project.get<AnyProjectData, AnyProjectMemberData>(dbVersion.projectID);

    const project = projectAdapter.fromDB(dbProject);
    const version = versionAdapter.fromDB(dbVersion, { platform: dbProject.platform as PlatformType });
    const slots = slotAdapter.mapFromDB(dbVersion.platformData.slots);
    const intents = intentAdapter(platform).mapFromDB(dbVersion.platformData.intents);
    const products =
      'products' in dbProject.platformData ? productAdapter.mapFromDB(Object.values((dbProject.platformData as AlexaProjectData).products)) : [];

    batch(() => {
      dispatch(Creator.resetCreator());
      dispatch(Product.replaceProducts(products));
      dispatch(Intent.replaceIntents(intents));
      dispatch(Slot.replaceSlots(slots));
      dispatch(Project.addProject(project.id, project));
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
    sourcePlatform: PlatformType;
    targetPlatform: PlatformType;
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
  const platform = Project.activePlatformSelector(state);

  Errors.assertVersionID(versionID);

  const slots = slotAdapter.mapToDB(Slot.allSlotsSelector(state));
  const intents = intentAdapter(platform).mapToDB(Intent.allIntentsSelector(state));

  await client.api.version.updatePlatformData<AlexaVersionData>(versionID, { slots, intents });
};

export const saveLocales =
  (locales: AnyLocale[]): Thunk =>
  async (dispatch, getState) => {
    if (!locales?.length) return;

    const state = getState();
    const platform = Project.activePlatformSelector(state);
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
    const platform = Project.activePlatformSelector(state);

    if (!versionID || !activeSession) throw Errors.noActiveVersionID();

    dispatch(updateSessionByVersionID(versionID, session));

    await client.platform(platform).version.updateSettings(versionID, {
      session: createSessionAdapter({ platform }).toDB({ ...activeSession, ...session }, { defaultVoice }) as BaseVersionSettings<any>['session'],
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
