import suite from '@/../test/_suite';
import { rewriteDispatch } from '@/store/utils';

suite('Store | Utils | Dispatch', ({ spy, expect }) => {
  describe('rewriteDispatch()', () => {
    const clientNodeID = 'clientNodeID';

    it('add origin to dispatched actions', () => {
      const action = { type: 'mock_action', payload: null };
      const store = {
        dispatch: { local: spy() },
        client: { nodeId: clientNodeID },
      };

      const result = rewriteDispatch(store as any)(action);

      expect(result).to.eql(action);
      expect(store.dispatch.local).to.be.calledWithExactly({ ...action, meta: { origin: clientNodeID } });
    });

    it('add origin to dispatched actions with existing meta', () => {
      const action = { type: 'mock_action', payload: null, meta: { foo: 'bar' } };
      const store = {
        dispatch: { local: spy() },
        client: { nodeId: clientNodeID },
      };

      const result = rewriteDispatch(store as any)(action);

      expect(result).to.eql(action);
      expect(store.dispatch.local).to.be.calledWithExactly({ ...action, meta: { ...action.meta, origin: clientNodeID } });
    });

    it('executes dispatched thunks', () => {
      const type = 'state_action';
      const state = { foo: 'bar' };
      const output = { fizz: 'buzz' };
      const log = Symbol('log');
      const store = {
        dispatch: { local: spy() },
        getState: () => state,
        client: { nodeId: clientNodeID },
        log,
      };

      const result = rewriteDispatch(store as any)((dispatch, getState, extras) => {
        dispatch({ type, payload: getState() });

        expect(extras).to.eql({ log });

        return output;
      });

      expect(result).to.eq(output);
      expect(store.dispatch.local).to.be.calledWithExactly({ type, payload: state, meta: { origin: clientNodeID } });
    });

    it('add origin to sync actions', () => {
      const syncAction = { type: 'sync_action', payload: null };
      const store = {
        dispatch: { sync: spy() },
        client: { nodeId: clientNodeID },
      };

      const dispatch = rewriteDispatch(store as any);

      dispatch.sync(syncAction);

      expect(store.dispatch.sync).to.be.calledWithExactly({ ...syncAction, meta: { origin: clientNodeID } });
    });
  });
});
