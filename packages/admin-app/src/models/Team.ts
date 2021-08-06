import { Board } from './Board';
import { Charge } from './Charge';

export interface Team {
  beta_flag: number;
  boards: Board[];
  charges?: Charge[];
  created: string;
  creator_id: number;
  expiry: string | null;
  image: string | null;
  name: string;
  period: string;
  plan: string;
  projects: number;
  seats: number;
  status: number;
  stripe_id: string | null;
  stripe_status: string | null;
  stripe_sub_id: string | null;
  team_id: number;
  templates: boolean;
  website: null | string;
}
