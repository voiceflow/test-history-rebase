import type { BlockType } from '@voiceflow/realtime-sdk';

export interface CMSWorkflowSortContext {
  triggersMapByDiagramID: Partial<Record<string, { type: BlockType; label: string; nodeID: string }[]>>;
}
