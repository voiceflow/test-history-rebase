import type { Member } from '../types';

export interface MemberItem extends Omit<Member, 'expiry' | 'isOrganizationAdmin'> {
  name: string;
  creator_id: number;
}
