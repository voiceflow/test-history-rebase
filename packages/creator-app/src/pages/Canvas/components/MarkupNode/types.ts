import * as Realtime from '@voiceflow/realtime-sdk';

export type ResizableMarkupNodeData = Realtime.Markup.NodeData.Image;

export interface ConnectedMarkupNodeProps<T extends Realtime.Markup.AnyNodeData = Realtime.Markup.AnyNodeData> {
  data: Realtime.NodeData<T>;
  ref: React.Ref<any>;
}
