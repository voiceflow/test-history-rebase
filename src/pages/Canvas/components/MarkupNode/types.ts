import { Markup, Node, NodeData } from '@/models';

export type ConnectedMarkupNodeProps<T extends Markup.AnyNodeData = Markup.AnyNodeData> = {
  node: Node;
  data: NodeData<T>;
};
