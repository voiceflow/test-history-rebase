import { Icon } from '@voiceflow/ui';

import { BlockType, DragItem } from '@/constants';
import { NodeData } from '@/models';

export interface StepDragItem {
  type: DragItem;
  icon: Icon | React.FC;
  label: string;
  blockType: BlockType;
  factoryData?: NodeData<any>;
  iconColor?: string;
}
