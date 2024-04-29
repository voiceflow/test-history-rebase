import type { Flow } from '@voiceflow/dtos';

export interface IFlowMenu {
  width?: number | string;
  onClose: VoidFunction;
  onSelect: (wlow: Flow) => void;
  excludeIDs?: string[];
}
