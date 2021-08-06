import { Project } from './Project';

export interface Workspace {
  expiry: string;
  team_id: number;
  created: string;
  seats: number;
  plan: string;
  role: string;
  projects: Project[];
}
