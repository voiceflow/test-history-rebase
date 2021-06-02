export type ProjectList = {
  id: string;
  name: string;
  projects: string[];
  isNew?: boolean;
};

export type DBProjectList = {
  board_id: string;
  name: string;
  projects: string[];
};
