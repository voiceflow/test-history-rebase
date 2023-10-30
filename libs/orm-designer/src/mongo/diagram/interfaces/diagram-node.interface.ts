import type { AnyRecord } from '@voiceflow/common';

export interface DiagramNode {
  type: string;
  data: AnyRecord;
  nodeID: string;
  coords?: [number, number];
}
