import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { ResizableMarkupNodeData } from './types';

export const isResizableShape = (data: Realtime.NodeData<unknown>): data is Realtime.NodeData<ResizableMarkupNodeData> =>
  [BlockType.MARKUP_IMAGE].includes(data.type);

export const isText = (data: Realtime.NodeData<unknown>): data is Realtime.NodeData<Realtime.Markup.NodeData.Text> =>
  data.type === BlockType.MARKUP_TEXT;
