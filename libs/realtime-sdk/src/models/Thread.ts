import { Assign } from 'utility-types';
// Frontend type

export interface Comment {
  id: string;
  text: string;
  created: string;
  mentions: Array<number>;
  threadID: string;
  creatorID: number;
}

export interface Thread {
  id: string;
  projectID: string;
  diagramID: string;
  nodeID: string | null;
  position: [number, number];
  creatorID: number;
  resolved: boolean;
  comments: Comment[];
  deleted: boolean;
}

export type NewComment = Pick<Comment, 'text' | 'mentions'>;

export type NewThread = Assign<Omit<Thread, 'id'>, { comments: [Pick<Comment, 'creatorID' | 'text' | 'mentions'>] }>;

// Backend type

export interface DBComment {
  comment_id: string;
  thread_id: string;
  created_at: string; // timestamp
  text: string;
  mentions: Array<number>;
  creator_id: number;
}

export interface DBThread {
  thread_id: string;
  project_id: string;
  diagram_id: string;
  node_id: string | null;
  position: [number, number];
  creator_id: number;
  resolved: boolean;
  comments: DBComment[];
  deleted: boolean;
}
