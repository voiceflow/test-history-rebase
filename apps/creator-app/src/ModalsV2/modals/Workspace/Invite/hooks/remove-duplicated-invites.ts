import { Utils } from '@voiceflow/common';
import { Members, usePersistFunction } from '@voiceflow/ui';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

export const useDedupeInvites = () => {
  const members = useSelector(WorkspaceV2.active.allNormalizedMembersSelector);

  return usePersistFunction((emails: string[], invitees?: Members.Types.Member[]) => {
    const inviteesMap = invitees ? Utils.array.createMap(invitees, ({ email }) => email) : {};
    const membersMap = Utils.array.createMap(members, ({ email }) => email);
    const newInvitees = emails.filter((email) => !inviteesMap[email] && !membersMap[email]);

    if (!newInvitees.length) {
      throw new Error(emails.length > 1 ? 'Members are already in this workspace.' : `Member is already in this workspace.`);
    }

    return newInvitees;
  });
};
