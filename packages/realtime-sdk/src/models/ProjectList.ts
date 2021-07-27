/* eslint-disable camelcase */

export interface ProjectList {
  id: string;
  name: string;
  isNew?: boolean;
  projects: string[];
}

export interface DBProjectList {
  name: string;
  board_id: string;
  projects: string[];
}
