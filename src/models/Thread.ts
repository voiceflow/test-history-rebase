/* eslint-disable camelcase */
import { Pair } from '@/types';

import { Comment, DBComment } from './Comment';

// Frontend type

export type Thread = {
  id: string;
  projectID: string;
  diagramID: string;
  nodeID: string | null;
  position: Pair<number>;
  creatorID: number;
  resolved: boolean;
  comments: Comment[];
};

// Backend type

export type DBThread = {
  thread_id: string;
  project_id: string;
  diagram_id: string;
  node_id: string | null;
  position: Pair<number>;
  creator_id: number;
  resolved: boolean;
  comments: DBComment[];
};
