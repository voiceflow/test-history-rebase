import { UserRole } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import * as Models from '@/models';
import * as ColorUtils from '@/utils/colors';

import suite from './_suite';

const MEMBER = { name: 'Tim', creator_id: 456, role: UserRole.ADMIN };
const MEMBERS = [{ name: 'Jane', creator_id: 123, role: UserRole.EDITOR }, MEMBER, { name: 'Eric', creator_id: 789, role: UserRole.VIEWER }];
const SEAT_LIMITS = { editor: 10 };
const WORKSPACE = {
  id: 'abc',
  name: 'Personal',
  seats: 4,
  plan: 'pro',
  members: MEMBERS,
  seatLimits: SEAT_LIMITS,
} as Models.Workspace;
const OTHER_WORKSPACE = {
  id: 'def',
  name: 'Team',
  seats: 4,
  plan: 'pro',
  members: [{ name: 'Joey', creator_id: 786, role: UserRole.VIEWER }],
} as Models.Workspace;
const SIMPLE_WORKSPACE = {
  id: 'mno',
  name: 'demo',
  members: [] as any,
} as Models.Workspace;
const MOCK_STATE: Workspace.WorkspaceState = {
  activeWorkspaceID: WORKSPACE.id,
  byId: {
    [WORKSPACE.id]: WORKSPACE,
    [OTHER_WORKSPACE.id]: OTHER_WORKSPACE,
    [SIMPLE_WORKSPACE.id]: SIMPLE_WORKSPACE,
  },
  allIds: [WORKSPACE.id, OTHER_WORKSPACE.id, SIMPLE_WORKSPACE.id],
};

suite(Workspace, MOCK_STATE)('Ducks - Workspace', ({ expect, stub, stubLocalStorage, describeReducer, describeSelectors }) => {
  describeReducer(({ expectAction }) => {
    describe('updateCurrentWorkspace()', () => {
      it('should update the active workspace', () => {
        const workspaceID = 'ghi';
        const { setItem } = stubLocalStorage();

        expectAction(Workspace.updateCurrentWorkspace(workspaceID)).toModify({ activeWorkspaceID: workspaceID });

        expect(setItem).to.be.calledWithExactly('team', workspaceID);
      });
    });

    describe('updateWorkspaces()', () => {
      it('should update workspace state', () => {
        const nextWorkspaces = {
          byId: {
            ghi: { name: 'Shared' } as Models.Workspace,
          },
          allIds: ['ghi'],
        };

        expectAction(Workspace.updateWorkspaces(nextWorkspaces)).toModify(nextWorkspaces);
      });
    });
  });

  describeSelectors(({ select, createState }) => {
    describe('activeWorkspaceIDSelector()', () => {
      it('should select the active workspace ID', () => {
        expect(select(Workspace.activeWorkspaceIDSelector)).to.eq(WORKSPACE.id);
      });
    });

    describe('activeWorkspaceSelector()', () => {
      it('should select the active workspace', () => {
        expect(select(Workspace.activeWorkspaceSelector)).to.eq(WORKSPACE);
      });
    });

    describe('workspaceNumberOfSeatsSelector()', () => {
      it('should select the number of seats of the active workspace', () => {
        expect(select(Workspace.workspaceNumberOfSeatsSelector)).to.eq(4);
      });
    });

    describe('planTypeSelector()', () => {
      it('should select the plan of the active workspace', () => {
        expect(select(Workspace.planTypeSelector)).to.eq('pro');
      });
    });

    describe('isOnPaidPlanSelector()', () => {
      it('should select whether the active workspace is on a paid plan', () => {
        const ROOT_STATE = {
          feature: {
            features: {
              isEnabled: true,
            },
          },
        };
        expect(select(Workspace.isOnPaidPlanSelector, ROOT_STATE)).to.be.true;
      });
    });

    describe('workspaceByIDSelector()', () => {
      it('should select a workspace by ID', () => {
        expect(select(Workspace.workspaceByIDSelector)(WORKSPACE.id)).to.eq(WORKSPACE);
      });
    });

    describe('activeWorkspaceMembersSelector()', () => {
      it('should select members of the active workspace', () => {
        expect(select(Workspace.activeWorkspaceMembersSelector)).to.eq(MEMBERS);
      });

      it('should select an empty array if no members listed', () => {
        expect(select(Workspace.activeWorkspaceMembersSelector, createState({ ...MOCK_STATE, activeWorkspaceID: SIMPLE_WORKSPACE.id }))).to.eql([]);
      });
    });

    describe('seatLimitsSelector()', () => {
      it('should select the seat limits of the active workspace', () => {
        expect(select(Workspace.seatLimitsSelector)).to.eq(SEAT_LIMITS);
      });
    });

    describe('usedEditorSeatsSelector()', () => {
      it('should select the number of occupied seats in the active workspace', () => {
        expect(select(Workspace.usedEditorSeatsSelector)).to.eq(2);
      });

      it('should always have at least 1 used seat', () => {
        expect(select(Workspace.usedEditorSeatsSelector, createState({ ...MOCK_STATE, activeWorkspaceID: 'def' }))).to.eq(1);
      });
    });

    describe('usedViewerSeatsSelector()', () => {
      it('should select the number of viewers in the active workspace', () => {
        expect(select(Workspace.usedViewerSeatsSelector)).to.eq(1);
      });
    });

    describe('allWorkspacesSelector()', () => {
      it('should select all workspaces', () => {
        expect(select(Workspace.allWorkspacesSelector)).to.eql([WORKSPACE, OTHER_WORKSPACE, SIMPLE_WORKSPACE]);
      });
    });

    describe('activeWorkspaceMemberSelector()', () => {
      it('should select a member from the active workspace by creator ID', () => {
        expect(select(Workspace.activeWorkspaceMemberSelector)('456')).to.eq(MEMBER);
      });

      it('should return null if no member matches for active workspace', () => {
        expect(select(Workspace.activeWorkspaceMemberSelector)('999')).to.be.null;
      });

      it('should return null members list', () => {
        expect(select(Workspace.activeWorkspaceMemberSelector, createState({ ...MOCK_STATE, activeWorkspaceID: 'def' }))('999')).to.be.null;
      });
    });

    describe('anyWorkspaceMemberSelector()', () => {
      it('should select a member from the active workspace by creator ID', () => {
        expect(select(Workspace.anyWorkspaceMemberSelector)('456')).to.eq(MEMBER);
      });

      it('should return null if no member matches in all workspaces', () => {
        expect(select(Workspace.anyWorkspaceMemberSelector)('999')).to.be.null;
      });
    });

    describe('distinctWorkspaceMemberSelector()', () => {
      const tabID = 'xyz';

      it('should select a a distinct member from the active workspace by creator ID', () => {
        const color = 'orange';
        const getAlternativeColor = stub(ColorUtils, 'getAlternativeColor').returns(color);

        expect(select(Workspace.distinctWorkspaceMemberSelector)('456', tabID)).to.eql({ ...MEMBER, color });

        expect(getAlternativeColor).to.be.calledWithExactly(tabID);
      });

      it('should return null if no member matches', () => {
        expect(select(Workspace.distinctWorkspaceMemberSelector)('999', tabID)).to.be.null;
      });
    });
  });
});
