import { UserRole } from '@voiceflow/internal';

export interface Member {
  role: UserRole;
  name: string | null;
  image: string | null;
  email: string;
  expiry?: string;
  projects?: string[];
  creator_id: number | null;
}
