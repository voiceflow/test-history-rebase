export interface Display {
  id: string;
  creatorID: number;
  skillID: number;
  document: string;
  datasource: string;
  name: string;
  description: string | null;
}

export interface DBDisplay {
  id: string;
  creator_id: number;
  skill_id: number;
  document: string;
  datasource: string;
  title: string;
  description: string | null;
}
