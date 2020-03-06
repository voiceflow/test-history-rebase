import { UserRole } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import * as ColorUtils from '@/utils/colors';

import suite from './_suite';

const WORKSPACE_ID = 'abc';
const MEMBER = { name: 'Tim', creator_id: 456, role: UserRole.ADMIN };
const MEMBERS = [{ name: 'Jane', creator_id: 123, role: UserRole.EDITOR }, MEMBER, { name: 'Eric', creator_id: 789, role: UserRole.VIEWER }];
const SEAT_LIMITS = { editor: 10 };
const WORKSPACE = {
  name: 'Personal',
  seats: 4,
  plan: 'pro',
  members: MEMBERS,
  seatLimits: SEAT_LIMITS,
};
const MOCK_STATE = {
  activeWorkspaceID: WORKSPACE_ID,
  byId: {
    abc: WORKSPACE,
    def: { name: 'Team' },
  },
  allIds: ['abc', 'def'],
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
            ghi: { name: 'Shared' },
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
        expect(select(Workspace.activeWorkspaceIDSelector)).to.eq(WORKSPACE_ID);
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

    describe('onPaidPlan()', () => {
      it('should select whether the active workspace is on a paid plan', () => {
        expect(select(Workspace.onPaidPlan)).to.be.true;
      });
    });

    describe('workspaceByIDSelector()', () => {
      it('should select a workspace by ID', () => {
        expect(select(Workspace.workspaceByIDSelector)(WORKSPACE_ID)).to.eq(WORKSPACE);
      });
    });

    describe('activeWorkspaceMembersSelector()', () => {
      it('should select members of the active workspace', () => {
        expect(select(Workspace.activeWorkspaceMembersSelector)).to.eq(MEMBERS);
      });

      it('should select an empty array if no members listed', () => {
        expect(select(Workspace.activeWorkspaceMembersSelector, createState({ ...MOCK_STATE, activeWorkspaceID: 'def' }))).to.eql([]);
      });
    });

    describe('seatLimits()', () => {
      it('should select the seat limits of the active workspace', () => {
        expect(select(Workspace.seatLimits)).to.eq(SEAT_LIMITS);
      });
    });

    describe('usedEditorSeats()', () => {
      it('should select the number of occupied seats in the active workspace', () => {
        expect(select(Workspace.usedEditorSeats)).to.eq(2);
      });

      it('should always have at least 1 used seat', () => {
        expect(select(Workspace.usedEditorSeats, createState({ ...MOCK_STATE, activeWorkspaceID: 'def' }))).to.eq(1);
      });
    });

    describe('usedViewerSeats()', () => {
      it('should select the number of viewers in the active workspace', () => {
        expect(select(Workspace.usedViewerSeats)).to.eq(1);
      });
    });

    describe('allWorkspacesSelector()', () => {
      it('should select all workspaces', () => {
        expect(select(Workspace.allWorkspacesSelector)).to.eql([WORKSPACE, { name: 'Team' }]);
      });
    });

    describe('workspaceMemberSelector()', () => {
      it('should select a member from the active workspace by creator ID', () => {
        expect(select(Workspace.workspaceMemberSelector)('456')).to.eq(MEMBER);
      });

      it('should return null if no member matches', () => {
        expect(select(Workspace.workspaceMemberSelector)('999')).to.be.null;
      });

      it('should return null members list', () => {
        expect(select(Workspace.workspaceMemberSelector, createState({ ...MOCK_STATE, activeWorkspaceID: 'def' }))('999')).to.be.null;
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
