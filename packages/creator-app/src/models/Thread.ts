import { Assign } from 'utility-types';

import { Pair } from '@/types';

import { Comment, DBComment } from './Comment';

// Frontend type

export interface Thread {
  id: string;
  projectID: string;
  diagramID: string;
  nodeID: string | null;
  position: Pair<number>;
  creatorID: number;
  resolved: boolean;
  comments: Comment[];
  deleted: boolean;
}

export type NewThread = Assign<Omit<Thread, 'id'>, { comments: [Pick<Comment, 'creatorID' | 'text' | 'mentions'>] }>;

// Backend type

export interface DBThread {
  thread_id: string;
  project_id: string;
  diagram_id: string;
  node_id: string | null;
  position: Pair<number>;
  creator_id: number;
  resolved: boolean;
  comments: DBComment[];
  deleted: boolean;
}
