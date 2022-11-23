import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

export const getRoleFacets = (members: Array<Realtime.WorkspaceMember | Realtime.PendingWorkspaceMember>) => {
  return members.reduce(
    (acc, member) => ({
      ...acc,
      [member.role]: (acc[member.role] ?? 0) + 1,
      all: (acc.all || 0) + 1,
    }),
    {} as Record<UserRole | 'all', number>
  );
};
