import * as ReduxUndo from 'redux-undo';

import client from '@/client';
import { toast } from '@/components/Toast';
import * as Creator from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';
import * as RealtimeUtils from '@/ducks/realtime/utils';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import * as Workspace from '@/ducks/workspace';

import suite from './_suite';

const DIAGRAM_ID = 'abc';
const USER_LOCKS = {
  [DIAGRAM_ID]: {
    ghi: '123',
  },
};
const LOCKS = {
  blocks: {
    [Realtime.LockType.MOVEMENT]: { jkl: 'eea', def: 'ghi' },
    [Realtime.LockType.EDIT]: { jkl: 'mno' },
  },
  users: USER_LOCKS,
  resources: {
    settings: 'mno',
  },
};
const MOCK_STATE = {
  locks: LOCKS,
  diagramID: DIAGRAM_ID,
  lastTimestamp: 12345,
  connected: true,
  sessionBusy: true,
  errorState: true,
};

suite(Realtime, MOCK_STATE)('Ducks - Realtime', ({ expect, stub, describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(({ expectAction }) => {
    describe('initializeRealtime()', () => {
      it('should initialize realtime state', () => {
        const diagramID = 'qrs';
        const locks = {
          blocks: {
            movement: { xyz: 'ghi' },
          },
        };

        expectAction(Realtime.initializeRealtime(diagramID, locks)).toModify({
          diagramID,
          locks: { ...locks, users: {} },
          lastTimestamp: null,
          connected: true,
          errorState: false,
          sessionBusy: false,
        });
      });

      it('should initialize realtime state with user locks', () => {
        const diagramID = 'qrs';
        const locks = {
          blocks: {
            movement: { xyz: 'ghi' },
          },
          users: {
            [diagramID]: {
              def: 'iop',
            },
          },
        };

        expectAction(Realtime.initializeRealtime(diagramID, locks))
          .result.property('locks')
          .to.eql(locks);
      });
    });

    describe('resetRealtime()', () => {
      it('should reset realtime state', () => {
        expectAction(Realtime.resetRealtime()).result.eq(Realtime.INITIAL_STATE);
      });
    });

    describe('updateLastTimestamp()', () => {
      it('should update timestamp of last received update', () => {
        const timestamp = 40000;

        expectAction(Realtime.updateLastTimestamp(timestamp)).toModify({ lastTimestamp: timestamp });
      });
    });

    describe('updateActiveDiagramViewers()', () => {
      it('should update locks to remove inactive users', () => {
        const userLocks = { abc: { mno: '123' } };

        expectAction(Realtime.updateActiveDiagramViewers(userLocks)).toModify({
          locks: {
            ...LOCKS,
            blocks: {
              ...LOCKS.blocks,
              movement: {},
            },
            users: userLocks,
          },
        });
      });

      it('should clear all locks', () => {
        expectAction(Realtime.updateActiveDiagramViewers({})).toModify({
          locks: {
            blocks: {
              edit: {},
              movement: {},
            },
            resources: {},
            users: {},
          },
        });
      });
    });

    describe('addNodeLocks()', () => {
      it('should add new node locks', () => {
        const tabID = 'tty';

        expectAction(Realtime.addNodeLocks(['EDIT', 'Delete'], ['cvv', 'ajj'], tabID)).toModify({
          locks: {
            ...LOCKS,
            blocks: {
              ...LOCKS.blocks,
              delete: {
                ajj: tabID,
                cvv: tabID,
              },
              edit: {
                ...LOCKS.blocks.edit,
                ajj: tabID,
                cvv: tabID,
              },
            },
          },
        });
      });
    });

    describe('removeNodeLocks()', () => {
      it('should remove node locks', () => {
        expectAction(Realtime.removeNodeLocks(['movement', 'delete'], ['def'])).toModify({
          locks: {
            ...LOCKS,
            blocks: {
              ...LOCKS.blocks,
              movement: { jkl: 'eea' },
              delete: {},
            },
          },
        });
      });
    });

    describe('addResourceLock()', () => {
      it('should add resource lock', () => {
        const tabID = 'abc';

        expectAction(Realtime.addResourceLock('variables', tabID)).toModify({
          locks: {
            ...LOCKS,
            resources: {
              ...LOCKS.resources,
              variables: tabID,
            },
          },
        });
      });
    });

    describe('removeResourceLock()', () => {
      it('should remove resource lock', () => {
        expectAction(Realtime.removeResourceLock('settings')).toModify({
          locks: {
            ...LOCKS,
            resources: {},
          },
        });
      });
    });

    describe('connectRealtime()', () => {
      it('should set realtime connection as active', () => {
        expectAction(Realtime.connectRealtime())
          .withState({ ...MOCK_STATE, connected: false })
          .toModify({ connected: true });
      });
    });

    describe('disconnectRealtime()', () => {
      it('should set realtime connection as inactive', () => {
        expectAction(Realtime.disconnectRealtime()).toModify({ connected: false });
      });
    });

    describe('setErrorState()', () => {
      it('should set realtime error state', () => {
        expectAction(Realtime.setErrorState())
          .withState({ ...MOCK_STATE, errorState: false })
          .toModify({ errorState: true });
      });
    });

    describe('setSessionBusy()', () => {
      it('should set realtime session as busy', () => {
        expectAction(Realtime.setSessionBusy())
          .withState({ ...MOCK_STATE, sessionBusy: false })
          .toModify({ sessionBusy: true });
      });
    });

    describe('resetSessionBusy()', () => {
      it('should set realtime session as free', () => {
        expectAction(Realtime.resetSessionBusy()).toModify({ sessionBusy: false });
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('realtimeDiagramIDSelector()', () => {
      it('should return active realtime diagram ID', () => {
        expect(select(Realtime.realtimeDiagramIDSelector)).to.eq(DIAGRAM_ID);
      });
    });

    describe('realtimeLocksSelector()', () => {
      it('should return realtime locks', () => {
        expect(select(Realtime.realtimeLocksSelector)).to.eq(LOCKS);
      });
    });

    describe('isRealtimeConnectedSelector()', () => {
      it('should return whether realtime is connected', () => {
        expect(select(Realtime.isRealtimeConnectedSelector)).to.be.true;
      });
    });

    describe('isErrorStateSelector()', () => {
      it('should return whether realtime is in an error state', () => {
        expect(select(Realtime.isErrorStateSelector)).to.be.true;
      });
    });

    describe('lastRealtimeTimestampSelector()', () => {
      it('should return latest realtime timestamp', () => {
        expect(select(Realtime.lastRealtimeTimestampSelector)).to.eq(12345);
      });
    });

    describe('isNodeLockedSelector()', () => {
      it('should return node is locked', () => {
        expect(select(Realtime.isNodeLockedSelector)('edit', 'jkl')).to.be.true;
      });

      it('should return node is not locked', () => {
        expect(select(Realtime.isNodeLockedSelector)('delete', 'def')).to.be.false;
      });
    });

    describe('isNodeMovementLockedSelector()', () => {
      it('should return whether node is movement locked', () => {
        expect(select(Realtime.isNodeMovementLockedSelector)('def')).to.be.true;
      });
    });

    describe('isNodeEditLockedSelector()', () => {
      it('should return whether node is edit locked', () => {
        expect(select(Realtime.isNodeEditLockedSelector)('jkl')).to.be.true;
      });
    });

    describe('deletionLockedNodesSelector()', () => {
      it('should return a lookup of all nodes which cannot be deleted', () => {
        expect(select(Realtime.deletionLockedNodesSelector)).to.eql({ def: 'ghi', jkl: 'mno' });
      });
    });

    describe('lockOwnerTabIDSelector()', () => {
      it('should return whether node is edit locked', () => {
        expect(select(Realtime.lockOwnerTabIDSelector)('edit', 'jkl')).to.eq('mno');
      });
    });

    describe('reourceLockOwnerTabIDSelector()', () => {
      it('should return whether node is edit locked', () => {
        expect(select(Realtime.reourceLockOwnerTabIDSelector)('settings')).to.eq('mno');
      });
    });

    describe('isSessionBusy()', () => {
      it('should return whether realtime session is busy', () => {
        expect(select(Realtime.isSessionBusy)).to.be.true;
      });
    });
  });

  describeSideEffects(({ applyEffect, createState, stubEffect }) => {
    const stubRealtimeClient = (name) => {
      const clientMethod = stub();

      stub(client, 'socket').get(() => ({ realtime: { [name]: clientMethod } }));

      return clientMethod;
    };

    describe('updateDiagramViewers()', () => {
      it('should update active diagrams with no viewers', async () => {
        const users = {};
        stub(Skill, 'activeDiagramIDSelector').returns('890');
        stub(Workspace, 'workspaceMemberSelector');

        const { dispatch, expectDispatch } = await applyEffect(Realtime.updateDiagramViewers(users));

        expectDispatch(Realtime.updateActiveDiagramViewers(users));
        expect(dispatch).to.be.calledOnce;
      });

      it('should update active diagrams with a single, pre-existing viewer', async () => {
        stub(Skill, 'activeDiagramIDSelector').returns(DIAGRAM_ID);
        stub(Workspace, 'workspaceMemberSelector').returns(() => true);

        const { dispatch, expectDispatch } = await applyEffect(Realtime.updateDiagramViewers(USER_LOCKS));

        expectDispatch(Creator.saveHistory({ force: true, preventUpdate: true }));
        expectDispatch(ReduxUndo.ActionCreators.clearHistory());
        expectDispatch(Realtime.updateActiveDiagramViewers(USER_LOCKS));
        expect(dispatch).to.be.calledThrice;
      });

      it('should update active diagrams with many new viewers', async () => {
        const workspaceID = '8379dd';
        const users = {
          [DIAGRAM_ID]: {
            klo: 'omp',
            qwe: 'rty',
          },
        };
        const [getMembers, getMembersEffect] = stubEffect(Workspace, 'getMembers');
        stub(Skill, 'activeDiagramIDSelector').returns(DIAGRAM_ID);
        stub(Workspace, 'workspaceMemberSelector').returns(() => false);
        stub(Workspace, 'activeWorkspaceIDSelector').returns(workspaceID);

        const { dispatch, expectDispatch } = await applyEffect(Realtime.updateDiagramViewers(users));

        expect(getMembers).to.be.calledWithExactly(workspaceID);
        expectDispatch(Realtime.updateActiveDiagramViewers(users));
        expectDispatch(getMembersEffect);
        expect(dispatch).to.be.calledTwice;
      });
    });

    describe('sendHeartbeat()', () => {
      it('should make heartbeat call to API', () => {
        const sendHeartbeat = stubRealtimeClient('sendHeartbeat');

        applyEffect(Realtime.sendHeartbeat());

        expect(sendHeartbeat).to.be.called;
      });
    });

    describe('sendRealtimeUpdate()', () => {
      const action = { type: 'SOME_ACTION' };
      const serverAction = { type: 'server::SOME_ACTION' };

      it('should send realtime update action when connected', async () => {
        const sendUpdate = stubRealtimeClient('sendUpdate');
        const createServerAction = stub(RealtimeUtils, 'createServerAction').returns(serverAction);

        await applyEffect(Realtime.sendRealtimeUpdate(action));

        expect(sendUpdate).to.be.calledWithExactly(action, MOCK_STATE.lastTimestamp, undefined, serverAction);
        expect(createServerAction).to.be.calledWithExactly(action);
      });

      it('should send realtime update action with locks', async () => {
        const lockAction = { type: 'lock::SOME_ACTION' };
        const updateLockAction = { type: 'SOME_ACTION', meta: { lock: lockAction } };
        const sendUpdate = stubRealtimeClient('sendUpdate');
        stub(RealtimeUtils, 'createServerAction').returns(serverAction);

        await applyEffect(Realtime.sendRealtimeUpdate(updateLockAction));

        expect(sendUpdate).to.be.calledWithExactly(updateLockAction, MOCK_STATE.lastTimestamp, lockAction, serverAction);
      });

      it('should not send realtime update action when disconnected', async () => {
        const sendUpdate = stubRealtimeClient('sendUpdate');

        await applyEffect(Realtime.sendRealtimeUpdate(action), createState({ ...MOCK_STATE, connected: false }));

        expect(sendUpdate).to.not.be.called;
      });
    });

    describe('sendRealtimeVolatileUpdate()', () => {
      const volatileAction = { type: 'SOME_ACTION' };

      it('should send realtime volatile action when connected', async () => {
        const sendVolatileUpdate = stubRealtimeClient('sendVolatileUpdate');

        await applyEffect(Realtime.sendRealtimeVolatileUpdate(volatileAction));

        expect(sendVolatileUpdate).to.be.calledWithExactly(volatileAction);
      });

      it('should not send realtime volatile action when disconnected', async () => {
        const sendVolatileUpdate = stubRealtimeClient('sendVolatileUpdate');

        await applyEffect(Realtime.sendRealtimeVolatileUpdate(volatileAction), createState({ ...MOCK_STATE, connected: false }));

        expect(sendVolatileUpdate).to.not.be.called;
      });
    });

    describe('sendRealtimeProjectUpdate()', () => {
      const projectAction = { type: 'SOME_ACTION' };

      it('should send realtime project action when connected', async () => {
        const sendProjectUpdate = stubRealtimeClient('sendProjectUpdate');

        await applyEffect(Realtime.sendRealtimeProjectUpdate(projectAction));

        expect(sendProjectUpdate).to.be.calledWithExactly(projectAction, MOCK_STATE.lastTimestamp, undefined);
      });

      it('should send realtime project action with locks', async () => {
        const lockAction = { type: 'lock::SOME_ACTION' };
        const projectLockAction = { type: 'SOME_ACTION', meta: { lock: lockAction } };
        const sendProjectUpdate = stubRealtimeClient('sendProjectUpdate');

        await applyEffect(Realtime.sendRealtimeProjectUpdate(projectLockAction));

        expect(sendProjectUpdate).to.be.calledWithExactly(projectLockAction, MOCK_STATE.lastTimestamp, lockAction);
      });

      it('should not send realtime project action when disconnected', async () => {
        const sendProjectUpdate = stubRealtimeClient('sendProjectUpdate');

        await applyEffect(Realtime.sendRealtimeProjectUpdate(projectAction), createState({ ...MOCK_STATE, connected: false }));

        expect(sendProjectUpdate).to.not.be.called;
      });
    });

    describe('terminateRealtimeConnection()', () => {
      it('should end and clean up active realtime connection', async () => {
        const terminate = stubRealtimeClient('terminate');

        const { expectDispatch } = await applyEffect(Realtime.terminateRealtimeConnection());

        expectDispatch(Realtime.disconnectRealtime());
        expectDispatch(Realtime.resetRealtime());
        expect(terminate).to.be.called;
      });
    });

    describe('handleRealtimeTakeover()', () => {
      it('should attempt to takeover a realtime session', async () => {
        const initiateSessionTakeOver = stubRealtimeClient('initiateSessionTakeOver');

        const { expectDispatch } = await applyEffect(Realtime.handleRealtimeTakeover());

        expectDispatch(Realtime.resetSessionBusy());
        expect(initiateSessionTakeOver).to.be.called;
      });
    });

    describe('handleSessionCancelled()', () => {
      const workspaceID = 'abcdef';
      const workspaceName = 'Team Workspace';

      it('should remove access to the current workspace', async () => {
        const [removeWorkspace, removeWorkspaceEffect] = stubEffect(Workspace, 'removeWorkspace');
        const infoToast = stub(toast, 'info');
        stub(Workspace, 'activeWorkspaceIDSelector').returns(workspaceID);

        const { dispatch, expectDispatch } = await applyEffect(Realtime.handleSessionCancelled({ workspaceId: workspaceID, workspaceName }));

        expectDispatch(Router.goToDashboard());
        expectDispatch(removeWorkspaceEffect);
        expect(dispatch).to.be.calledTwice;
        expect(removeWorkspace).to.be.calledWithExactly(workspaceID);
        expect(infoToast).to.be.calledWithExactly(`You are no longer a collaborator for "${workspaceName}" workspace`);
      });

      it('should remove access to a workspace', async () => {
        const [, removeWorkspaceEffect] = stubEffect(Workspace, 'removeWorkspace');
        stub(Workspace, 'activeWorkspaceIDSelector').returns('12d9d8');

        const { dispatch, expectDispatch } = await applyEffect(Realtime.handleSessionCancelled({ workspaceId: workspaceID, workspaceName }));

        expectDispatch(removeWorkspaceEffect);
        expect(dispatch).to.be.calledOnce;
      });
    });

    describe('setupRealtimeConnection()', () => {
      const skillID = '1234';
      const diagramID = '5678';
      const tabID = '90210';

      it('should setup a realtime connection', async () => {
        const locks = { blocks: { movement: { def: tabID } } };
        const filteredLocks = { blocks: { movement: {} } };
        const initialize = stubRealtimeClient('initialize').returns(locks);
        const removeSelfFromLocks = stub(RealtimeUtils, 'removeSelfFromLocks').returns(filteredLocks);
        stub(Session, 'tabIDSelector').returns(tabID);

        const { dispatch, expectDispatch } = await applyEffect(Realtime.setupRealtimeConnection(skillID, diagramID));

        expectDispatch(Realtime.initializeRealtime(diagramID, filteredLocks));
        expect(dispatch).to.be.calledTwice;
        expect(initialize).to.be.calledWithExactly(skillID, diagramID);
        expect(removeSelfFromLocks).to.be.calledWithExactly(locks, tabID);
      });

      it('should set session as busy', async () => {
        stubRealtimeClient('initialize').throws();
        stub(Session, 'tabIDSelector').returns(tabID);

        const { dispatch, expectDispatch } = await applyEffect(Realtime.setupRealtimeConnection(skillID, diagramID));

        expectDispatch(Realtime.setSessionBusy());
        expect(dispatch).to.be.calledOnce;
      });
    });

    describe.skip('setupActiveDiagramConnection()', () => {
      it('should setup a realtime connection', async () => {
        const skillID = '1234';
        const diagramID = '5678';
        stub(Skill, 'activeSkillIDSelector').returns(skillID);
        stub(Skill, 'activeDiagramIDSelector').returns(diagramID);

        const { expectDispatch } = await applyEffect(Realtime.setupRealtimeConnection(skillID, diagramID));

        expectDispatch();
      });
    });
  });
});
