import type * as Realtime from '@voiceflow/realtime-sdk';

import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

export interface BaseFormProps {
  editor: NodeEditorV2Props<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts>;
}

export interface FormProps extends BaseFormProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
