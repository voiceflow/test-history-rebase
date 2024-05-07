import type { Flow } from '@voiceflow/dtos';

export interface IFlowMenu {
  width?: number | string;
  onClose: VoidFunction;
  maxWidth?: number | string;
  onSelect: (wlow: Flow) => void;
  excludeIDs?: string[];
}
