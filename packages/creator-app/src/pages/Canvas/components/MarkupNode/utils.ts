import * as Realtime from '@voiceflow/realtime-sdk';

import { ResizableMarkupNodeData } from './types';

export const isResizableShape = (data: Realtime.NodeData<unknown>): data is Realtime.NodeData<ResizableMarkupNodeData> =>
  Realtime.Utils.typeGuards.isMarkupMediaNodeData(data);

export const isText = Realtime.Utils.typeGuards.isMarkupTextNodeData;
