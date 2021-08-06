import { Markup, Node, NodeData } from '@/models';

export type ResizableMarkupNodeData = Markup.NodeData.Image;

export interface ConnectedMarkupNodeProps<T extends Markup.AnyNodeData = Markup.AnyNodeData> {
  node: Node;
  data: NodeData<T>;
  ref: React.Ref<any>;
}
