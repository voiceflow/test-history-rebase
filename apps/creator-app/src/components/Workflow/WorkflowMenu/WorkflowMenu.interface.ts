import type { Workflow } from '@voiceflow/dtos';

export interface IWorkflowMenu {
  width?: number | string;
  onClose: VoidFunction;
  maxWidth?: number | string;
  onSelect: (workflow: Workflow) => void;
  excludeIDs?: string[];
}
