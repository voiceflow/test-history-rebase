import { Utils } from '@voiceflow/common';

import type { DesignerAction } from '@/types';
import type { WorkspaceAction } from '@/workspace/workspace.action';

import { assistantAction } from '../assistant.action';

const awarenessType = Utils.protocol.typeFactory(assistantAction('awareness'));

export interface ReplaceViewerIDs extends WorkspaceAction {
  viewers: Record<string, number[]>;
}

export const ReplaceViewerIDs = Utils.protocol.createAction<ReplaceViewerIDs>(awarenessType('REPLACE_VIEWER_IDS'));

export interface ReplaceAssistantViewerIDs extends DesignerAction {
  assistantViewers: number[];
}

export const ReplaceAssistantViewerIDs = Utils.protocol.createAction<ReplaceAssistantViewerIDs>(
  awarenessType('REPLACE_ASSISTANT_VIEWER_IDS')
);

export interface UpdateAssistantViewerIDs extends DesignerAction {
  assistantViewers: number[];
}

export const UpdateAssistantViewerIDs = Utils.protocol.createAction<UpdateAssistantViewerIDs>(
  awarenessType('UPDATE_ASSISTANT_VIEWER_IDs')
);

export interface ReplaceAssistantViewerIDsPerFlow extends DesignerAction {
  connectedViewerIDsPerFlow: Record<string, number[]>;
}

export const ReplaceAssistantViewerIDsPerFlow = Utils.protocol.createAction<ReplaceAssistantViewerIDsPerFlow>(
  awarenessType('LOAD_ASSISTANT_VIEWER_IDS_PER_FLOW')
);

export interface UpdateAssistantFlowViewerIDs extends DesignerAction {
  flowID: string;
  viewerIDs: number[];
}

export const UpdateAssistantFlowViewerIDs = Utils.protocol.createAction<UpdateAssistantFlowViewerIDs>(
  awarenessType('UPDATE_ASSISTANT_FLOW_VIEWER_IDS')
);
