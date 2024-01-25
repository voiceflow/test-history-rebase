/* eslint-disable sonarjs/no-duplicate-string, mocha/no-identical-title */
import { PlanType, UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspaceV2';

import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const CREATOR_ID = 999;
const EMAIL = 'creator@voiceflow.com';
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID };

const WORKSPACE_MEMBER = {
  name: 'creator',
  image: 'http://example.com/avatar.png',
  creator_id: CREATOR_ID,
  role: UserRole.ADMIN,
  seats: 3,
  email: EMAIL,
  created: '',
  status: null,
};

const WORKSPACE: Realtime.Workspace = {
  id: WORKSPACE_ID,
  creatorID: CREATOR_ID,
  name: 'workspace',
  created: '',
  image: 'http://example.com/image.png',
  projects: 3,
  seats: 5,
  plan: PlanType.PRO,
  organizationID: null,
  organizationTrialDaysLeft: 3,
  state: null,
  planSeatLimits: { viewer: 10, editor: 20 },
  boards: [],
  members: Normal.normalize(
    [
      WORKSPACE_MEMBER,
      {
        name: 'view only creator',
        image: 'http://example.com/avatar.png',
        creator_id: 1000,
        role: UserRole.VIEWER,
        email: 'viewer@voiceflow.com',
        created: '',
      },
    ],
    (member) => String(member.creator_id)
  ),
  pendingMembers: Normal.normalize(
    [
      {
        name: null,
        image: null,
        creator_id: null,
        role: UserRole.VIEWER,
        email: 'pending@voiceflow.com',
        created: '',
      },
    ],
    (member) => member.email
  ),
};

const MOCK_STATE: Workspace.WorkspaceState = {
  byKey: {
    [WORKSPACE_ID]: WORKSPACE,
    abc: {
      id: 'abc',
      creatorID: 1000,
      name: 'alphabet workspace',
      organizationID: null,
      organizationTrialDaysLeft: 0,
      state: null,
      created: '',
      image: 'http://example.com/image.png',
      projects: 3,
      seats: 5,
      plan: PlanType.PRO,
      planSeatLimits: { viewer: 10, editor: 20 },
      members: Normal.createEmpty(),
      pendingMembers: Normal.createEmpty(),
    },
  },
  allKeys: [WORKSPACE_ID, 'abc'],
};

suite(Workspace, MOCK_STATE)('Ducks - Workspace V2', ({ describeReducerV2, createState, ...utils }) => {
  describe('reducer', () => {
    utils.assertIgnoresOtherActions();
    utils.assertInitialState(Workspace.INITIAL_STATE);

    describeReducerV2(Realtime.workspace.member.add, ({ applyAction }) => {
      const member = { ...WORKSPACE_MEMBER, name: 'new member', email: 'new.member@voiceflow.com', creator_id: 123 };

      it('add a new workspace member', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, member });

        expect(result.byKey[WORKSPACE_ID].members).toEqual(Normal.append(WORKSPACE.members, String(member.creator_id), member));
      });

      it('do nothing if workspace does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, workspaceID: 'foo', member });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.workspace.member.remove, ({ applyAction }) => {
      it('remove an existing workspace member', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: 1000 });

        expect(result.byKey[WORKSPACE_ID].members).toEqual(Normal.normalize([WORKSPACE_MEMBER], (member) => String(member.creator_id)));
      });

      it('do nothing if member does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: 1001 });

        expect(result.byKey[WORKSPACE_ID].members).toEqual(WORKSPACE.members);
      });

      it('do nothing if workspace does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, workspaceID: 'foo', creatorID: CREATOR_ID });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.workspace.member.cancelInvite, ({ applyAction }) => {
      it('cancel the invite of an existing workspace member', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, email: 'pending@voiceflow.com' });

        expect(result.byKey[WORKSPACE_ID].pendingMembers).toEqual(Normal.createEmpty());
      });

      it('do nothing if member does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, email: 'foo@bar.com' });

        expect(result.byKey[WORKSPACE_ID].pendingMembers).toEqual(WORKSPACE.pendingMembers);
      });

      it('do nothing if workspace does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, workspaceID: 'foo', email: EMAIL });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.workspace.member.patch, ({ applyAction }) => {
      const member = { role: UserRole.BILLING };

      it('patch an existing workspace member', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: CREATOR_ID, member });

        expect(result.byKey[WORKSPACE_ID].members.byKey[CREATOR_ID]).toEqual({ ...WORKSPACE_MEMBER, role: UserRole.BILLING });
      });

      it('do nothing if member does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, creatorID: 1001, member });

        expect(result).toBe(MOCK_STATE);
      });

      it('do nothing if workspace does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, workspaceID: 'foo', creatorID: CREATOR_ID, member });

        expect(result).toBe(MOCK_STATE);
      });
    });

    describeReducerV2(Realtime.workspace.member.updateInvite, ({ applyAction }) => {
      it('patch an existing workspace member', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, email: 'pending@voiceflow.com', role: UserRole.BILLING });

        expect(result.byKey[WORKSPACE_ID].pendingMembers.byKey['pending@voiceflow.com']).toContain({ role: UserRole.BILLING });
      });

      it('do nothing if member does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, email: 'foo@bar.com', role: UserRole.BILLING });

        expect(result).toBe(MOCK_STATE);
      });

      it('do nothing if workspace does not exist', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, workspaceID: 'foo', email: EMAIL, role: UserRole.BILLING });

        expect(result).toBe(MOCK_STATE);
      });
    });
  });

  describe('selectors', () => {
    const activeWorkspaceState = { [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID } };

    describe('active', () => {
      describe('workspaceSelector()', () => {
        it('should select the active workspace', () => {
          expect(Workspace.active.workspaceSelector(createState(MOCK_STATE, activeWorkspaceState))).toBe(WORKSPACE);
        });
      });

      describe('memberByIDSelector()', () => {
        it('should select a member from the active workspace by creator ID', () => {
          expect(
            Workspace.active.memberByIDSelector(createState(MOCK_STATE, activeWorkspaceState), {
              creatorID: CREATOR_ID,
            })
          ).toBe(WORKSPACE_MEMBER);
        });

        it('should return null if no member matches for active workspace', () => {
          expect(
            Workspace.active.memberByIDSelector(createState(MOCK_STATE, activeWorkspaceState), {
              creatorID: 222,
            })
          ).toBeNull();
        });

        it('should return null members list', () => {
          expect(Workspace.active.memberByIDSelector(createState(MOCK_STATE), { creatorID: 999 })).toBeNull();
        });
      });

      describe('numberOfSeatsSelector()', () => {
        it('should select the number of seats of the active workspace', () => {
          expect(Workspace.active.numberOfSeatsSelector(createState(MOCK_STATE, activeWorkspaceState))).toBe(5);
        });
      });

      describe('planSeatLimitsSelector()', () => {
        it('should select the seat limits of the active workspace', () => {
          expect(Workspace.active.planSeatLimitsSelector(createState(MOCK_STATE, activeWorkspaceState))).toEqual({ viewer: 10, editor: 20 });
        });
      });

      describe('usedEditorSeatsSelector()', () => {
        it('should select the number of occupied seats in the active workspace', () => {
          expect(Workspace.active.usedEditorSeatsSelector(createState(MOCK_STATE, activeWorkspaceState))).toEqual(1);
        });

        it('should always have at least 1 used seat', () => {
          expect(Workspace.active.usedEditorSeatsSelector(createState(MOCK_STATE, { [Session.STATE_KEY]: { activeWorkspaceID: 'def' } }))).toEqual(1);
        });
      });

      describe('usedViewerSeatsSelector()', () => {
        it('should select the number of viewers in the active workspace', () => {
          expect(Workspace.active.usedViewerSeatsSelector(createState(MOCK_STATE, activeWorkspaceState))).toEqual(2);
        });
      });
    });

    describe('allWorkspacesSelector()', () => {
      it('select all workspaces', () => {
        const result = Workspace.allWorkspacesSelector(createState(MOCK_STATE));

        expect(result).toEqual([WORKSPACE, MOCK_STATE.byKey.abc]);
      });
    });

    describe('allWorkspaceIDsSelector()', () => {
      it('select all workspace IDs', () => {
        const result = Workspace.allWorkspaceIDsSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.allKeys);
      });
    });

    describe('workspaceByIDSelector()', () => {
      it('select known workspace', () => {
        const result = Workspace.workspaceByIDSelector(createState(MOCK_STATE), { id: WORKSPACE_ID });

        expect(result).toBe(WORKSPACE);
      });

      it('select unknown workspace', () => {
        const result = Workspace.workspaceByIDSelector(createState(MOCK_STATE), { id: 'foo' });

        expect(result).toBeNull();
      });
    });
  });
});
