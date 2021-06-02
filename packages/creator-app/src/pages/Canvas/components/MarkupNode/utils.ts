import { BlockType } from '@/constants';
import { Markup, NodeData } from '@/models';

import { ResizableMarkupNodeData } from './types';

export const isResizableShape = (data: NodeData<unknown>): data is NodeData<ResizableMarkupNodeData> => [BlockType.MARKUP_IMAGE].includes(data.type);

export const isText = (data: NodeData<unknown>): data is NodeData<Markup.NodeData.Text> => data.type === BlockType.MARKUP_TEXT;
