import type * as Realtime from '@voiceflow/realtime-sdk';

export interface ResizableMarkupNodeData extends Realtime.Markup.NodeData.Media {
  scale?: number;
  overrideWidth?: number;
}

export interface ConnectedMarkupNodeProps<T extends Realtime.Markup.AnyNodeData = Realtime.Markup.AnyNodeData> {
  data: Realtime.NodeData<T>;
  ref: React.Ref<any>;
}
