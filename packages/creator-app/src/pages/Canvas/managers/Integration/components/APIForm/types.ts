import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

export interface BaseFormProps {
  editor: NodeEditorV2Props<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts>;
}
