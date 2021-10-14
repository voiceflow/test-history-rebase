/* eslint-disable camelcase */

export interface ProjectList {
  id: string;
  name: string;
  projects: string[];
  /**
   * @deprecated
   */
  isNew?: boolean;
}

export interface DBProjectList {
  name: string;
  board_id: string;
  projects: string[];
}
