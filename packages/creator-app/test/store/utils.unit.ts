import suite from '@/../test/_suite';
import { rewriteDispatch } from '@/store/utils';

suite('Store | Utils', ({ spy, expect }) => {
  describe('rewriteDispatch()', () => {
    const clientNodeID = 'clientNodeID';

    it('add origin to dispatched actions', () => {
      const action = { type: 'mock_action', payload: null };
      const store = {
        dispatch: spy(),
        client: { nodeId: clientNodeID },
      };

      const result = rewriteDispatch(store as any)(action);

      expect(result).to.eql(action);
      expect(store.dispatch).to.be.calledWithExactly({ ...action, meta: { origin: clientNodeID } });
    });

    it('add origin to dispatched actions with existing meta', () => {
      const action = { type: 'mock_action', payload: null, meta: { foo: 'bar' } };
      const store = {
        dispatch: spy(),
        client: { nodeId: clientNodeID },
      };

      const result = rewriteDispatch(store as any)(action);

      expect(result).to.eql(action);
      expect(store.dispatch).to.be.calledWithExactly({ ...action, meta: { ...action.meta, origin: clientNodeID } });
    });

    it('executes dispatched thunks', () => {
      const type = 'state_action';
      const state = { foo: 'bar' };
      const output = { fizz: 'buzz' };
      const log = Symbol('log');
      const store = {
        dispatch: spy(),
        getState: () => state,
        client: { nodeId: clientNodeID },
        log,
      };

      const result = rewriteDispatch(store as any)((dispatch, getState, extras) => {
        dispatch({ type, payload: getState() });

        expect(extras).to.eql({ log, client: { nodeId: clientNodeID } });

        return output;
      });

      expect(result).to.eq(output);
      expect(store.dispatch).to.be.calledWithExactly({ type, payload: state, meta: { origin: clientNodeID } });
    });

    it('add origin to local, sync and crossTab actions', () => {
      const localAction = { type: 'local_action', payload: null };
      const syncAction = { type: 'sync_action', payload: null };
      const crossTabAction = { type: 'cross_tab_action', payload: null };
      const store = {
        dispatch: { local: spy(), sync: spy(), crossTab: spy() },
        client: { nodeId: clientNodeID },
      };

      const dispatch = rewriteDispatch(store as any);

      dispatch.local(localAction);
      dispatch.sync(syncAction);
      dispatch.crossTab(crossTabAction);

      expect(store.dispatch.local).to.be.calledWithExactly({ ...localAction, meta: { origin: clientNodeID } });
      expect(store.dispatch.sync).to.be.calledWithExactly({ ...syncAction, meta: { origin: clientNodeID } });
      expect(store.dispatch.crossTab).to.be.calledWithExactly({ ...crossTabAction, meta: { origin: clientNodeID } });
    });
  });
});
