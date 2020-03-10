export type Display = {
  id: string;
  creatorID: number;
  skillID: number;
  document: string;
  datasource: string;
  title: string;
  description: string | null;
};

export type DBDisplay = {
  id: string;
  creator_id: number;
  skill_id: number;
  document: string;
  datasource: string;
  title: string;
  description: string | null;
};
