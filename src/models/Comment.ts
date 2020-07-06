/* eslint-disable camelcase */

// Frontend type

export type Comment = {
  id: string;
  threadID: string;
  created: string;
  text: string;
  mentions: Array<number>;
  creatorID: number;
};

// Backend type

export type DBComment = {
  comment_id: string;
  thread_id: string;
  created_at: string; // timestamp
  text: string;
  mentions: Array<number>;
  creator_id: number;
};
