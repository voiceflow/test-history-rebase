import { BlockType } from '@/constants';
import { Markup, NodeData } from '@/models';

import { ResizableMarkupNodeData } from './types';

export const isResizableShape = (data: NodeData<any>): data is NodeData<ResizableMarkupNodeData> => [BlockType.MARKUP_IMAGE].includes(data.type);

export const isText = (data: NodeData<any>): data is NodeData<Markup.NodeData.Text> => data.type === BlockType.MARKUP_TEXT;
