import suite from '@/../test/_suite';
import { rewriteDispatch } from '@/store/utils';

suite('Store | Utils', () => {
  describe('rewriteDispatch()', () => {
    const clientNodeID = 'clientNodeID';

    it('add origin to dispatched actions', () => {
      const action = { type: 'mock_action', payload: null };
      const store = {
        dispatch: vi.fn(),
        client: { nodeId: clientNodeID },
      };

      const result = rewriteDispatch(store as any)(action);

      expect(result).toEqual(action);
      expect(store.dispatch).toBeCalledWith({ ...action, meta: { origin: clientNodeID } });
    });

    it('add origin to dispatched actions with existing meta', () => {
      const action = { type: 'mock_action', payload: null, meta: { foo: 'bar' } };
      const store = {
        dispatch: vi.fn(),
        client: { nodeId: clientNodeID },
      };

      const result = rewriteDispatch(store as any)(action);

      expect(result).toEqual(action);
      expect(store.dispatch).toBeCalledWith({ ...action, meta: { ...action.meta, origin: clientNodeID } });
    });

    it('executes dispatched thunks', () => {
      const type = 'state_action';
      const state = { foo: 'bar' };
      const output = { fizz: 'buzz' };
      const log = Symbol('log');
      const store = {
        dispatch: vi.fn(),
        getState: () => state,
        client: { nodeId: clientNodeID },
        log,
      };

      const result = rewriteDispatch(store as any)((dispatch, getState, extras) => {
        dispatch({ type, payload: getState() });

        expect(extras).toEqual({ log, client: { nodeId: clientNodeID } });

        return output;
      });

      expect(result).toBe(output);
      expect(store.dispatch).toBeCalledWith({ type, payload: state, meta: { origin: clientNodeID } });
    });

    it('add origin to local, sync and crossTab actions', () => {
      const localAction = { type: 'local_action', payload: null };
      const syncAction = { type: 'sync_action', payload: null };
      const crossTabAction = { type: 'cross_tab_action', payload: null };
      const store = {
        dispatch: { local: vi.fn(), sync: vi.fn(), crossTab: vi.fn() },
        client: { nodeId: clientNodeID },
      };

      const dispatch = rewriteDispatch(store as any);

      dispatch.local(localAction);
      dispatch.sync(syncAction);
      dispatch.crossTab(crossTabAction);

      expect(store.dispatch.local).toBeCalledWith({ ...localAction, meta: { origin: clientNodeID } });
      expect(store.dispatch.sync).toBeCalledWith({ ...syncAction, meta: { origin: clientNodeID } });
      expect(store.dispatch.crossTab).toBeCalledWith({ ...crossTabAction, meta: { origin: clientNodeID } });
    });
  });
});
