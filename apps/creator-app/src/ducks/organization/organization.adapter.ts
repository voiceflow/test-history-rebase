import { OrganizationLegacyMember, OrganizationMember } from '@voiceflow/dtos';

export const toLegacyOrganizationMember = ({ id, role, ...user }: OrganizationMember): OrganizationLegacyMember =>
  ({ ...user, creatorID: id, role }) as OrganizationLegacyMember;
