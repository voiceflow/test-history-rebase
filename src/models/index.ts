import { Link } from './Link';
import { Node } from './Node';
import { NodeData } from './NodeData';
import { Port } from './Port';

export * from './Account';
export * from './AccountLinking';
export * from './Billing';
export * from './CreatorDiagram';
export * from './Diagram';
export * from './Display';
export * from './Node';
export * from './NodeData';
export * from './Port';
export * from './Product';
export * from './Project';
export * from './ProjectList';
export * from './Skill';
export * from './Template';
export * from './User';
export * from './Link';
export * from './Integration';
export * from './Intent';
export * from './Slot';
export * from './Workspace';
export * from './Markup';
export * from './Query';

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
