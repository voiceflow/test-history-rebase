import { Markup, Node, NodeData } from '@/models';

export type ConnectedMarkupNodeProps<T extends Markup.NodeData = Markup.NodeData> = {
  node: Node;
  data: NodeData<T>;
};
