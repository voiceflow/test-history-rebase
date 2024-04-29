import { BlockType } from '@voiceflow/realtime-sdk';

export interface CMSWorkflowSortContext {
  membersMap: Partial<Record<string, { name: string; email: string }>>;
  triggersMapByDiagramID: Partial<Record<string, { type: BlockType; label: string; nodeID: string }[]>>;
}
