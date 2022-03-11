import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { batch } from 'react-redux';

import client from '@/client';
import * as Errors from '@/config/errors';
import { getDefaultPrototypeLayout, PrototypeLayout } from '@/constants/prototype';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Integration from '@/ducks/integration';
import * as Product from '@/ducks/product';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import * as Thread from '@/ducks/thread';
import * as VersionV2 from '@/ducks/versionV2';
import { Thunk } from '@/store/types';
import { storeLogger } from '@/store/utils';
import { getDistinctPlatformValue, setDistinctPlatformValue } from '@/utils/platform';

import { getActiveVersionContext } from '../../utils';

export * from './topicsComponents';
export * from './variables';

export const activateVersionV2 =
  ({ workspaceID, projectID, versionID, diagramID, projectType }: Realtime.version.ActivateVersionPayload): Thunk =>
  async (dispatch) => {
    const dbVersion = await client.api.version.get<Realtime.AnyDBVersion>(versionID);

    // not a dependency for project to load
    dispatch(Integration.fetchIntegrationUsers()).catch(() => storeLogger.warn('Unable to fetch integration users'));

    batch(() => {
      dispatch(Creator.resetCreator());
      dispatch(
        Prototype.updatePrototypeSettings(
          {
            ...dbVersion.prototype?.settings,
            layout: (dbVersion.prototype?.settings.layout ?? getDefaultPrototypeLayout(projectType)) as PrototypeLayout,
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

export const patchSession =
  (session: Partial<Realtime.Version.Session>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const activeSession = VersionV2.active.sessionSelector(state);

    if (!versionID || !activeSession) throw Errors.noActiveVersionID();

    await dispatch.sync(Realtime.version.patchSession({ ...getActiveVersionContext(state), session }));
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
