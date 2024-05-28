import { Workspace } from '@/ducks';

import { atomWithSelector } from './store.atom';

export const activeWorkspaceNormalizedMembersAtom = atomWithSelector(Workspace.active.members.membersSelector);
