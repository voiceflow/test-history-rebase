import { WithRequired } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

export * from './Account';
export * from './APIKey';
export * from './Billing';
export * from './Comment';
export * from './Display';
export * from './Job';
export * from './Project';
export * from './ProjectAPIKey';
export * from './Prototype';
export * from './Query';
export * from './ReportTag';
export * from './SAMLProvider';
export * from './Template';
export * from './Thread';
export * from './Transcript';
export * from './UploadProject';
export * from './VariableState';

export type PartialModel<T extends { id: string }> = WithRequired<Partial<T>, 'id'>;

export interface NodeWithData {
  node: Realtime.Node;
  data: Realtime.NodeData<unknown>;
}

export interface EntityMap {
  nodesWithData: NodeWithData[];
  ports: Realtime.Port[];
  links: Realtime.Link[];
}
