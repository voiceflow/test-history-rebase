import type { Flow } from '@voiceflow/dtos';

export interface IFlowSelect {
  flowID: string | null;
  onSelect: (flow: Flow) => void;
  excludeIDs?: string[];
}
