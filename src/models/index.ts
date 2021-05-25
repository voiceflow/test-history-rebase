import { Link } from './Link';
import { Node } from './Node';
import { NodeData } from './NodeData';
import { Port } from './Port';

export * from './Account';
export * from './AccountLinking';
export * from './Billing';
export * from './Comment';
export * from './CreatorDiagram';
export * from './Diagram';
export * from './Display';
export * from './Intent';
export * from './Job';
export * from './Link';
export * from './Markup';
export * from './Node';
export * from './NodeData';
export * from './Port';
export * from './Product';
export * from './Project';
export * from './ProjectList';
export * from './Prototype';
export * from './Query';
export * from './Skill';
export * from './Slot';
export * from './Speak';
export * from './Template';
export * from './Thread';
export * from './Version';
export * from './Workspace';

export type PartialModel<T extends { id: string }> = WithRequired<Partial<T>, 'id'>;

export type NodeWithData = {
  node: Node;
  data: NodeData<unknown>;
};

export type EntityMap = {
  nodesWithData: NodeWithData[];
  ports: Port[];
  links: Link[];
};
