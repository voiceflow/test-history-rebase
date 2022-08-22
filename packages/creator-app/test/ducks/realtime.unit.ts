import * as ReduxUndo from 'redux-undo';

import client from '@/client';
import { SocketClient } from '@/client/socket';
import * as Creator from '@/ducks/creator';
import * as Realtime from '@/ducks/realtime';
import * as RealtimeUtils from '@/ducks/realtime/utils';
import * as Session from '@/ducks/session';
import mutableStore from '@/store/mutable';

import suite from './_suite';

const TIMESTAMP = 12345;
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
};
const MOCK_STATE = {
  locks: LOCKS,
  diagramID: DIAGRAM_ID,
  connected: true,
  sessionBusy: true,
  errorState: true,
  restricted: false,
};

suite(Realtime, MOCK_STATE)('Ducks - Realtime', ({ describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(({ expectAction }) => {
    describe('initializeRealtime()', () => {
      it('should initialize realtime state', () => {
        const diagramID = 'qrs';
        const locks = {
          blocks: {
            [Realtime.LockType.MOVEMENT]: { xyz: 'ghi' },
            [Realtime.LockType.EDIT]: { lmn: 'opq' },
          },
        };

        expectAction(Realtime.initializeRealtime(diagramID, locks)).toModify({
          diagramID,
          locks: { ...locks, users: {} },
          connected: true,
          errorState: false,
          sessionBusy: false,
          restricted: false,
        });
      });

      it('should initialize realtime state with user locks', () => {
        const diagramID = 'qrs';
        const locks = {
          blocks: {
            [Realtime.LockType.MOVEMENT]: { xyz: 'ghi' },
            [Realtime.LockType.EDIT]: { lmn: 'opq' },
          },
          users: {
            [diagramID]: {
              def: 'iop',
            },
          },
        };

        expectAction(Realtime.initializeRealtime(diagramID, locks)).result.toEqual(expect.objectContaining({ locks }));
      });
    });

    describe('resetRealtime()', () => {
      it('should reset realtime state', () => {
        expectAction(Realtime.resetRealtime()).result.toBe(Realtime.INITIAL_STATE);
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
            users: {},
          },
        });
      });
    });

    describe('addNodeLocks()', () => {
      it('should add new node locks', () => {
        const tabID = 'tty';

        expectAction(Realtime.addNodeLocks(['EDIT', 'Delete'] as any[], ['cvv', 'ajj'], tabID)).toModify({
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
            } as any,
          },
        });
      });
    });

    describe('removeNodeLocks()', () => {
      it('should remove node locks', () => {
        expectAction(Realtime.removeNodeLocks([Realtime.LockType.MOVEMENT, 'delete'] as any[], ['def'])).toModify({
          locks: {
            ...LOCKS,
            blocks: {
              ...LOCKS.blocks,
              movement: { jkl: 'eea' },
              delete: {},
            } as any,
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
        expect(select(Realtime.realtimeDiagramIDSelector)).toBe(DIAGRAM_ID);
      });
    });

    describe('isRealtimeConnectedSelector()', () => {
      it('should return whether realtime is connected', () => {
        expect(select(Realtime.isRealtimeConnectedSelector)).toBeTruthy();
      });
    });

    describe('isErrorStateSelector()', () => {
      it('should return whether realtime is in an error state', () => {
        expect(select(Realtime.isErrorStateSelector)).toBeTruthy();
      });
    });

    describe('isSessionBusy()', () => {
      it('should return whether realtime session is busy', () => {
        expect(select(Realtime.isSessionBusy)).toBeTruthy();
      });
    });
  });

  describeSideEffects(({ applyEffect, createState }) => {
    const stubSocket = <K extends keyof SocketClient>(name: K, value: Partial<SocketClient[K]>) => {
      vi.spyOn(client.socket, name as any, 'get').mockReturnValue(value);
    };
    const stubSocketClient = <K extends keyof SocketClient>(clientName: K, name: keyof SocketClient[K]) => {
      const clientMethod = vi.fn();

      stubSocket(clientName, { [name]: clientMethod } as any);

      return clientMethod;
    };

    describe.skip('updateDiagramViewers()', () => {
      it('should update active diagrams with no viewers', async () => {
        const users = {};
        vi.spyOn(Session, 'activeDiagramIDSelector').mockReturnValue('890');

        const { dispatch, expectDispatch } = await applyEffect(Realtime.updateDiagramViewers(users));

        expectDispatch(Realtime.updateActiveDiagramViewers(users));
        expect(dispatch).toBeCalledTimes(1);
      });

      it('should update active diagrams with a single, pre-existing viewer', async () => {
        vi.spyOn(Session, 'activeDiagramIDSelector').mockReturnValue(DIAGRAM_ID);

        const { dispatch, expectDispatch } = await applyEffect(Realtime.updateDiagramViewers(USER_LOCKS));

        expectDispatch(Creator.saveHistory({ force: true, preventUpdate: true }));
        expectDispatch(ReduxUndo.ActionCreators.clearHistory());
        expectDispatch(Realtime.updateActiveDiagramViewers(USER_LOCKS));
        expect(dispatch).toBeCalledTimes(3);
      });

      it('should update active diagrams with many new viewers', async () => {
        const workspaceID = '8379dd';
        const users = {
          [DIAGRAM_ID]: {
            klo: 'omp',
            qwe: 'rty',
          },
        };

        vi.spyOn(Session, 'activeDiagramIDSelector').mockReturnValue(DIAGRAM_ID);

        vi.spyOn(Session, 'activeWorkspaceIDSelector').mockReturnValue(workspaceID);

        const { dispatch, expectDispatch } = await applyEffect(Realtime.updateDiagramViewers(users));

        expectDispatch(Realtime.updateActiveDiagramViewers(users));
        expect(dispatch).toBeCalledTimes(2);
      });
    });

    describe('sendRealtimeUpdate()', () => {
      const action: any = { type: 'SOME_ACTION' };
      const serverAction: any = { type: 'server::SOME_ACTION' };

      beforeEach(() => {
        mutableStore.setLastRealtimeTimestamp(TIMESTAMP);
      });

      it('should send realtime update action when connected', async () => {
        const sendUpdate = stubSocketClient('diagram', 'sendUpdate');
        const createServerAction = vi.spyOn(RealtimeUtils, 'createServerAction').mockReturnValue(serverAction);

        await applyEffect(Realtime.sendRealtimeUpdate(action));

        expect(sendUpdate).toBeCalledWith(action, TIMESTAMP, null, serverAction);
        expect(createServerAction).toBeCalledWith(action);
      });

      it('should send realtime update action with locks', async () => {
        const lockAction = { type: 'lock::SOME_ACTION' };
        const updateLockAction: any = { type: 'SOME_ACTION', meta: { lock: lockAction } };
        const sendUpdate = stubSocketClient('diagram', 'sendUpdate');
        vi.spyOn(RealtimeUtils, 'createServerAction').mockReturnValue(serverAction);

        await applyEffect(Realtime.sendRealtimeUpdate(updateLockAction));

        expect(sendUpdate).toBeCalledWith(updateLockAction, TIMESTAMP, lockAction, serverAction);
      });

      it('should not send realtime update action when disconnected', async () => {
        const sendUpdate = stubSocketClient('diagram', 'sendUpdate');

        await applyEffect(Realtime.sendRealtimeUpdate(action), createState({ ...MOCK_STATE, connected: false }) as any);

        expect(sendUpdate).not.toBeCalled();
      });
    });

    describe('sendRealtimeVolatileUpdate()', () => {
      const volatileAction: any = { type: 'SOME_ACTION' };

      it('should send realtime volatile action when connected', async () => {
        const sendVolatileUpdate = stubSocketClient('diagram', 'sendVolatileUpdate');

        await applyEffect(Realtime.sendRealtimeVolatileUpdate(volatileAction));

        expect(sendVolatileUpdate).toBeCalledWith(volatileAction);
      });

      it('should not send realtime volatile action when disconnected', async () => {
        const sendVolatileUpdate = stubSocketClient('diagram', 'sendVolatileUpdate');

        await applyEffect(Realtime.sendRealtimeVolatileUpdate(volatileAction), createState({ ...MOCK_STATE, connected: false }) as any);

        expect(sendVolatileUpdate).not.toBeCalled();
      });
    });

    describe('sendRealtimeProjectUpdate()', () => {
      const projectAction: any = { type: 'SOME_ACTION' };

      beforeEach(() => {
        mutableStore.setLastRealtimeTimestamp(TIMESTAMP);
      });

      it('should send realtime project action when connected', async () => {
        const sendUpdate = stubSocketClient('project', 'sendUpdate');

        await applyEffect(Realtime.sendRealtimeProjectUpdate(projectAction));

        expect(sendUpdate).toBeCalledWith(projectAction, TIMESTAMP, null);
      });

      it('should send realtime project action with locks', async () => {
        const lockAction = { type: 'lock::SOME_ACTION' };
        const projectLockAction: any = { type: 'SOME_ACTION', meta: { lock: lockAction } };
        const sendUpdate = stubSocketClient('project', 'sendUpdate');

        await applyEffect(Realtime.sendRealtimeProjectUpdate(projectLockAction));

        expect(sendUpdate).toBeCalledWith(projectLockAction, TIMESTAMP, lockAction);
      });

      it('should not send realtime project action when disconnected', async () => {
        const sendUpdate = stubSocketClient('project', 'sendUpdate');

        await applyEffect(Realtime.sendRealtimeProjectUpdate(projectAction), createState({ ...MOCK_STATE, connected: false }) as any);

        expect(sendUpdate).not.toBeCalled();
      });
    });

    describe('terminateRealtimeConnection()', () => {
      it('should end and clean up active realtime connection', async () => {
        const terminate = stubSocketClient('diagram', 'terminate');
        stubSocket('isConnected', () => true);

        const { expectDispatch } = await applyEffect(Realtime.terminateRealtimeConnection());

        expectDispatch(Realtime.disconnectRealtime());
        expectDispatch(Realtime.resetRealtime());
        expect(terminate).toBeCalled();
      });
    });

    describe('handleRealtimeTakeover()', () => {
      it('should attempt to takeover a realtime session', async () => {
        const takeoverSessioon = stubSocketClient('project', 'takeoverSession');

        const { expectDispatch } = await applyEffect(Realtime.handleRealtimeTakeover());

        expectDispatch(Realtime.resetSessionBusy());
        expect(takeoverSessioon).toBeCalled();
      });
    });

    describe('setupRealtimeConnection()', () => {
      const versionID = '1234';
      const diagramID = '5678';
      const tabID = '90210';
      const rootState = {
        session: {
          tabID,
        },
      };

      it('should setup a realtime connection', async () => {
        const locks = { blocks: { movement: { def: tabID } } };
        const filteredLocks: any = { blocks: { movement: {} } };
        const initialize = stubSocketClient('diagram', 'initialize').mockReturnValue(locks);
        const removeSelfFromLocks = vi.spyOn(RealtimeUtils, 'removeSelfFromLocks').mockReturnValue(filteredLocks);

        const { dispatch, expectDispatch } = await applyEffect(Realtime.setupRealtimeConnection(versionID, diagramID), rootState);

        expectDispatch(Realtime.initializeRealtime(diagramID, filteredLocks));
        expect(dispatch).toBeCalledTimes(2);
        expect(initialize).toBeCalledWith(versionID, diagramID);
        expect(removeSelfFromLocks).toBeCalledWith(locks, tabID);
      });

      it('should set session as busy', async () => {
        stubSocketClient('diagram', 'initialize').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw { browserId: 'abc', device: {} };
        });

        const { dispatch, expectDispatch } = await applyEffect(Realtime.setupRealtimeConnection(versionID, diagramID), rootState);

        expectDispatch(Realtime.setSessionBusy());
        expect(dispatch).toBeCalledTimes(1);
      });

      it('should set realtime restriction', async () => {
        stubSocketClient('diagram', 'initialize').mockImplementation(() => {
          // eslint-disable-next-line no-throw-literal
          throw { busyBy: ['11'] };
        });

        const { dispatch, expectDispatch } = await applyEffect(Realtime.setupRealtimeConnection(versionID, diagramID), rootState);

        expectDispatch(Realtime.setRealtimeRestriction());
        expect(dispatch).toBeCalledTimes(1);
      });
    });
  });
});
