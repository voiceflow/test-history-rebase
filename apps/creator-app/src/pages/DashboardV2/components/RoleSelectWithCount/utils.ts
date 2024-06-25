import type { UserRole } from '@voiceflow/dtos';
import type * as Realtime from '@voiceflow/realtime-sdk';

export const getRoleFacets = (members: Realtime.AnyWorkspaceMember[]) =>
  members.reduce<Partial<Record<UserRole | 'all', number>>>(
    (acc, member) => ({
      ...acc,
      [member.role]: (acc[member.role] ?? 0) + 1,
      all: (acc.all ?? 0) + 1,
    }),
    {}
  );
