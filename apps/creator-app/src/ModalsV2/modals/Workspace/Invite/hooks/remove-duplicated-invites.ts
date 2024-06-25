import { Utils } from '@voiceflow/common';
import type { Members } from '@voiceflow/ui';
import { usePersistFunction } from '@voiceflow/ui';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

export const useDedupeInvites = () => {
  const members = useSelector(WorkspaceV2.active.members.allMembersListSelector);

  return usePersistFunction((emails: string[], invitees?: Members.Types.Member[]) => {
    const inviteesMap = invitees ? Utils.array.createMap(invitees, ({ email }) => email) : {};
    const membersMap = Utils.array.createMap(members, ({ email }) => email);
    const newInvitees = emails.filter((email) => !inviteesMap[email] && !membersMap[email]);

    if (!newInvitees.length) {
      throw new Error(
        emails.length > 1 ? 'Members are already in this workspace.' : 'Member is already in this workspace.'
      );
    }

    return newInvitees;
  });
};
