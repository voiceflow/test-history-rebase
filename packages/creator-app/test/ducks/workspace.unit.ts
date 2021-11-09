/* eslint-disable max-nested-callbacks */
import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';

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
} as Realtime.Workspace;
const OTHER_WORKSPACE = {
  id: 'def',
  name: 'Team',
  seats: 4,
  plan: 'pro',
  members: [{ name: 'Joey', creator_id: 786, role: UserRole.VIEWER }],
} as Realtime.Workspace;
const SIMPLE_WORKSPACE = {
  id: 'mno',
  name: 'demo',
  members: [] as any,
} as Realtime.Workspace;

const MOCK_STATE = {
  byKey: {
    [WORKSPACE.id]: WORKSPACE,
    [OTHER_WORKSPACE.id]: OTHER_WORKSPACE,
    [SIMPLE_WORKSPACE.id]: SIMPLE_WORKSPACE,
  },
  allKeys: [WORKSPACE.id, OTHER_WORKSPACE.id, SIMPLE_WORKSPACE.id],
};
const ROOT_STATE = {
  session: { activeWorkspaceID: WORKSPACE.id },
  feature: { features: {} },
};

suite(Workspace, MOCK_STATE)('Ducks - Workspace', ({ expect, stub, rewire, describeSelectors }) => {
  describeSelectors(({ select }) => {
    describe('workspaceByIDSelector()', () => {
      it('should select a workspace by ID', () => {
        expect(select(Workspace.workspaceByIDSelector)(WORKSPACE.id)).to.eq(WORKSPACE);
      });
    });

    describe('allWorkspacesSelector()', () => {
      it('should select all workspaces', () => {
        expect(select(Workspace.allWorkspacesSelector)).to.eql([WORKSPACE, OTHER_WORKSPACE, SIMPLE_WORKSPACE]);
      });
    });

    describe('active', () => {
      describe('workspaceSelector()', () => {
        it('should select the active workspace', () => {
          expect(select(WorkspaceV2.active.workspaceSelector, ROOT_STATE)).to.eq(WORKSPACE);
        });
      });

      describe('membersSelector()', () => {
        it('should select members of the active workspace', () => {
          expect(select(WorkspaceV2.active.membersSelector, ROOT_STATE)).to.eq(MEMBERS);
        });

        it('should select an empty array if no members listed', () => {
          expect(select(WorkspaceV2.active.membersSelector, { ...ROOT_STATE, session: { activeWorkspaceID: SIMPLE_WORKSPACE.id } })).to.eql([]);
        });
      });

      describe('getMemberByIDSelector()', () => {
        it('should select a member from the active workspace by creator ID', () => {
          expect(select(WorkspaceV2.active.getMemberByIDSelector, ROOT_STATE)(456)).to.eq(MEMBER);
        });

        it('should return null if no member matches for active workspace', () => {
          expect(select(WorkspaceV2.active.getMemberByIDSelector, ROOT_STATE)(999)).to.be.null;
        });

        it('should return null members list', () => {
          expect(select(WorkspaceV2.active.getMemberByIDSelector, { ...ROOT_STATE, session: { activeWorkspaceID: 'def' } })(999)).to.be.null;
        });
      });

      describe.skip('getDistinctWorkspaceMemberByCreatorIDSelector()', () => {
        const tabID = 'xyz';

        it('should select a a distinct member from the active workspace by creator ID', async () => {
          const color = 'orange';
          const getAlternativeColor = stub().returns(color);

          const RewiredWorkspaceV2 = await rewire.around(
            () => import('@/ducks/workspaceV2'),
            (mock) => {
              mock(() => import('@voiceflow/ui'))
                .callThrough()
                .with({ getAlternativeColor });
            }
          );

          expect(select(RewiredWorkspaceV2.active.getDistinctWorkspaceMemberByCreatorIDSelector, ROOT_STATE)(456, tabID)).to.eql({
            ...MEMBER,
            color,
          });

          expect(getAlternativeColor).to.be.calledWithExactly(tabID);
        });

        it('should return null if no member matches', () => {
          expect(select(WorkspaceV2.active.getDistinctWorkspaceMemberByCreatorIDSelector, ROOT_STATE)(999, tabID)).to.be.null;
        });
      });

      describe('planSelector()', () => {
        it('should select the plan of the active workspace', () => {
          expect(select(WorkspaceV2.active.planSelector, ROOT_STATE)).to.eq('pro');
        });
      });

      describe('isOnPaidPlanSelector()', () => {
        it('should select whether the active workspace is on a paid plan', () => {
          expect(select(WorkspaceV2.active.isOnPaidPlanSelector, ROOT_STATE)).to.be.true;
        });
      });

      describe('numberOfSeatsSelector()', () => {
        it('should select the number of seats of the active workspace', () => {
          expect(select(WorkspaceV2.active.numberOfSeatsSelector, ROOT_STATE)).to.eq(4);
        });
      });

      describe('seatLimitsSelector()', () => {
        it('should select the seat limits of the active workspace', () => {
          expect(select(WorkspaceV2.active.seatLimitsSelector, ROOT_STATE)).to.eq(SEAT_LIMITS);
        });
      });

      describe('usedEditorSeatsSelector()', () => {
        it('should select the number of occupied seats in the active workspace', () => {
          expect(select(WorkspaceV2.active.usedEditorSeatsSelector, ROOT_STATE)).to.eq(2);
        });

        it('should always have at least 1 used seat', () => {
          expect(select(WorkspaceV2.active.usedEditorSeatsSelector, { ...ROOT_STATE, session: { activeWorkspaceID: 'def' } })).to.eq(1);
        });
      });

      describe('usedViewerSeatsSelector()', () => {
        it('should select the number of viewers in the active workspace', () => {
          expect(select(WorkspaceV2.active.usedViewerSeatsSelector, ROOT_STATE)).to.eq(1);
        });
      });
    });
  });
});
