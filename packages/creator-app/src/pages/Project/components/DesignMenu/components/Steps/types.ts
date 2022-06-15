import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';

import { BlockType, DragItem } from '@/constants';

export interface StepDragItem {
  type: DragItem;
  icon: SvgIconTypes.Icon | React.FC;
  label: string;
  blockType: BlockType;
  factoryData?: Realtime.NodeData<any>;
  iconColor?: string;
}
