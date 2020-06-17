import { BlockType, MarkupShapeType } from '@/constants';
import { Markup, NodeData } from '@/models';

import { ResizableMarkupNodeData } from './types';

export const isResizableShape = (data: NodeData<any>): data is NodeData<ResizableMarkupNodeData> =>
  [BlockType.MARKUP_IMAGE, BlockType.MARKUP_SHAPE].includes(data.type);

export const isText = (data: NodeData<any>): data is NodeData<Markup.NodeData.Text> => data.type === BlockType.MARKUP_TEXT;

export const isShape = (data: NodeData<any>): data is NodeData<Markup.NodeData.Shape> => data.type === BlockType.MARKUP_SHAPE;

export const isLine = (data: NodeData<Markup.NodeData.Shape>): data is NodeData<Markup.NodeData.Line | Markup.NodeData.Arrow> =>
  [MarkupShapeType.LINE, MarkupShapeType.ARROW].includes(data.shapeType);
