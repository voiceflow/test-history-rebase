import type { Workflow } from '@voiceflow/dtos';

export interface IWorkflowMenu {
  width?: number | string;
  onClose: VoidFunction;
  onSelect: (workflow: Workflow) => void;
  excludeIDs?: string[];
}
