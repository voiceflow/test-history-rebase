import { Markup, Node, NodeData } from '@/models';
import { Either } from '@/types';

export type ResizableMarkupNodeData = Markup.NodeData.Image | Markup.NodeData.Rectangle | Markup.NodeData.Circle;

export type ConnectedMarkupNodeProps<T extends Markup.AnyNodeData = Markup.AnyNodeData> = {
  node: Node;
  data: NodeData<T>;
  ref: React.Ref<any>;
};

export type MarkupRectangleInstance = {
  setAttribute: (key: string, value: string) => void;
};

export type MarkupLineInstance = {
  setLineAttribute: (key: string, value: string) => void;
  setHeadAttribute: (key: string, value: string) => void;
};

export type MarkupShapeInstance = Either<MarkupRectangleInstance, MarkupLineInstance>;
