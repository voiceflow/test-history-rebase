import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionEditorProps, NodeEditorV2Props } from '@/pages/Canvas/managers/types';

export const isCustomAPIEditor = (
  editor:
    | NodeEditorV2Props<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts>
    | NodeEditorV2Props<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts>
): editor is NodeEditorV2Props<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> =>
  editor.data.selectedIntegration === BaseNode.Utils.IntegrationType.CUSTOM_API;

export const isCustomAPIActionEditor = (
  editor:
    | ActionEditorProps<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts>
    | ActionEditorProps<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts>
): editor is ActionEditorProps<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> =>
  editor.data.selectedIntegration === BaseNode.Utils.IntegrationType.CUSTOM_API;
