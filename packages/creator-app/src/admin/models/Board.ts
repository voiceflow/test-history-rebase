import { Project } from './Project';

export type Board = {
  team_id: number;
  name: string;
  created: string;
  seats: number;
  plan: string;
  expiry: string | null;
  role: string;
  projects: Project[];
};
