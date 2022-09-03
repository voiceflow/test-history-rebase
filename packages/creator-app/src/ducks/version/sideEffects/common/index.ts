import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { batch } from 'react-redux';

import * as Errors from '@/config/errors';
import * as Diagram from '@/ducks/diagram';
import * as Feature from '@/ducks/feature';
import * as Integration from '@/ducks/integration';
import * as Product from '@/ducks/product';
import * as Session from '@/ducks/session';
import * as Thread from '@/ducks/thread';
import { waitAsync } from '@/ducks/utils';
import * as VersionV2 from '@/ducks/versionV2';
import * as Workspace from '@/ducks/workspace';
import { SyncThunk, Thunk } from '@/store/types';
import { storeLogger } from '@/store/utils';

import { getActivePlatformVersionContext } from '../../utils';

export * from './components';
export * from './variables';

/**
 * called after successfully subscribing to a realtime "version" channel
 * this is also called when re-connecting to an existing subscription
 */
export const initializeVersion =
  ({ workspaceID, projectID, versionID }: Realtime.version.ActivateVersionPayload): SyncThunk =>
  (dispatch, getState) => {
    // not a dependency for project to load
    dispatch(Integration.fetchIntegrationUsers()).catch(() => storeLogger.warn('Unable to fetch integration users'));

    const state = getState();
    const isNewWorkspace = Session.activeWorkspaceIDSelector(state) !== workspaceID;
    const AACommentingEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.ATOMIC_ACTIONS_COMMENTING);

    batch(() => {
      if (isNewWorkspace) {
        dispatch(Workspace.setActive(workspaceID));
      }

      dispatch(Session.setActiveProjectID(projectID));
      dispatch(Session.setActiveVersionID(versionID));

      if (!AACommentingEnabled) {
        dispatch(Thread.loadThreads(projectID));
      }
    });
  };

export const importProjectContext =
  ({
    nodes,
    products,
    diagrams,
  }: {
    nodes: { data: Realtime.NodeData<unknown>; node: Realtime.Node }[];
    products: Realtime.Product[];
    diagrams: Realtime.Diagram[];
    sourcePlatform: VoiceflowConstants.PlatformType;
    targetPlatform: VoiceflowConstants.PlatformType;
  }): Thunk<{ data: Realtime.NodeData<unknown>; node: Realtime.Node }[]> =>
  async (dispatch) => {
    let mappedNodes = nodes;

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
        const newDiagramID = await dispatch(
          diagram.type === BaseModels.Diagram.DiagramType.TOPIC ? Diagram.duplicateTopic(diagram.id) : Diagram.duplicateComponent(diagram.id)
        );

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

    await dispatch.sync(Realtime.version.patchSession({ ...getActivePlatformVersionContext(state), session }));
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

export const negotiateTargetVersion =
  (versionID: string): Thunk<Realtime.version.schema.NegotiateResultPayload> =>
  async (dispatch) =>
    dispatch(waitAsync(Realtime.version.schema.negotiate, { versionID, proposedSchemaVersion: Realtime.LATEST_SCHEMA_VERSION }));
