import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import * as Designer from '@/ducks/designer';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { waitAsync } from '@/ducks/utils';
import * as Workspace from '@/ducks/workspaceV2';
import { SyncThunk, Thunk } from '@/store/types';

import { active } from '../selectors';
import { getActivePlatformVersionContext } from '../utils';
import { platformFactory } from './utils';

export * from './components';

/**
 * called after successfully subscribing to a realtime "version" channel
 * this is also called when re-connecting to an existing subscription
 */
export const initializeVersion =
  ({ workspaceID, projectID, versionID }: Realtime.version.ActivateVersionPayload): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const isNewWorkspace = Session.activeWorkspaceIDSelector(state) !== workspaceID;

    if (isNewWorkspace) {
      dispatch(Workspace.setActive(workspaceID));
    }

    dispatch(Session.setActiveProjectID(projectID));
    // TODO: [replay] set session active version id here is causing some issues
    dispatch(Session.setActiveVersionID(versionID));
  };

export const importProjectContext =
  ({
    nodes,
    diagrams,
    sourceVersionID,
  }: {
    nodes: { data: Realtime.NodeData<unknown>; node: Realtime.Node }[];
    diagrams: Realtime.Diagram[];
    sourceVersionID: string;
  }): Thunk<{ data: Realtime.NodeData<unknown>; node: Realtime.Node }[]> =>
  async (dispatch, getState) => {
    let mappedNodes = nodes;
    const state = getState();
    const isCMSComponentsEnabled = Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_COMPONENTS);

    const componentIDs = diagrams.filter(({ type }) => type === BaseModels.Diagram.DiagramType.COMPONENT).map((diagram) => diagram.id);
    let newComponentIDs: string[] = [];

    if (isCMSComponentsEnabled) {
      const flows = await dispatch(Designer.Flow.effect.copyPasteMany({ sourceDiagramIDs: componentIDs, sourceEnvironmentID: sourceVersionID }));
      newComponentIDs = flows.map((flow) => flow.diagramID);
    } else {
      newComponentIDs = await Promise.all(componentIDs.map((diagramID) => dispatch(DiagramV2.duplicateComponent(sourceVersionID, diagramID))));
    }

    for (let i = 0; i < componentIDs.length; i++) {
      const componentID = componentIDs[i];
      const newComponentID = newComponentIDs[i];

      mappedNodes = mappedNodes.map((node) =>
        Realtime.Utils.node.isDiagramNode(node.data) && node.data.diagramID === componentID
          ? { ...node, data: { ...node.data, diagramID: newComponentID } }
          : node
      );
    }

    return mappedNodes;
  };

export const negotiateTargetVersion =
  (versionID: string): Thunk<Realtime.version.schema.NegotiateResultPayload> =>
  async (dispatch) =>
    dispatch(waitAsync(Realtime.version.schema.negotiate, { versionID, proposedSchemaVersion: Realtime.LATEST_SCHEMA_VERSION }));

// active version

export const { patchSession, patchSettings, patchPublishing } = platformFactory<
  Platform.Base.Models.Version.Session,
  Platform.Base.Models.Version.Settings.Model,
  Platform.Base.Models.Version.Publishing.Model
>();

export const patchDefaultStepColors =
  (defaultStepColors: BaseModels.Version.DefaultStepColors): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await dispatch.sync(Realtime.version.patchDefaultStepColors({ ...getActivePlatformVersionContext(getState()), defaultStepColors }));
  };

export const updateInvocationName =
  (invocationName: string, invocationNameSamples?: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const activeInvocationName = active.invocationNameSelector(state) ?? '';
    const activeInvocationNameSamples = active.invocationNameSamplesSelector(state);

    if (activeInvocationName === invocationName && !invocationNameSamples) return;

    Errors.assertVersionID(versionID);

    await dispatch(
      patchPublishing({
        invocationName,
        invocationNameSamples:
          invocationNameSamples ?? Utils.string.arrayStringReplace(activeInvocationName, invocationName, activeInvocationNameSamples),
      })
    );
  };

export const updateLocales =
  (locales?: string[]): Thunk =>
  async (dispatch, getState) => {
    if (!locales?.length) return;

    const state = getState();
    const projectMeta = ProjectV2.active.metaSelector(state);
    const projectConfig = Platform.Config.getTypeConfig(projectMeta);

    if (projectConfig.project.locale.storedIn === 'publishing') {
      await dispatch(patchPublishing({ locales }));
    } else {
      await dispatch(patchSettings({ locales }));
    }
  };
