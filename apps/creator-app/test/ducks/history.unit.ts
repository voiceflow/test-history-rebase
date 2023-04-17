import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as History from '@/ducks/history';
import { REPLAY_KEY } from '@/ducks/utils';

import suite from './_suite';
import { ACTION_CONTEXT } from './creatorV2/_fixtures';

const MOCK_STATE: History.HistoryState = {
  buffer: null,
  undo: [
    {
      id: '1',
      apply: [
        { type: 'foo/a', payload: null },
        { type: 'foo/b', payload: null },
      ],
      revert: [
        { type: 'fizz/x', payload: null },
        { type: 'fizz/y', payload: null },
      ],
    },
    {
      id: '2',
      apply: [
        { type: 'bar/a', payload: null },
        { type: 'bar/b', payload: null },
      ],
      revert: [
        { type: 'buzz/x', payload: null },
        { type: 'buzz/y', payload: null },
      ],
    },
  ],
  redo: [
    {
      id: '3',
      apply: [
        { type: 'zip/1', payload: null },
        { type: 'zip/2', payload: null },
      ],
      revert: [
        { type: 'zap/1', payload: null },
        { type: 'zap/2', payload: null },
      ],
    },
    {
      id: '4',
      apply: [
        { type: 'fee/1', payload: null },
        { type: 'fee/2', payload: null },
      ],
      revert: [
        { type: 'fo/1', payload: null },
        { type: 'fo/2', payload: null },
      ],
    },
  ],
};

suite(History, MOCK_STATE)('Ducks - History', ({ describeReducerV2, describeEffectV2, createState, ...utils }) => {
  describe('reducer', () => {
    utils.assertIgnoresOtherActions();
    utils.assertInitialState(History.INITIAL_STATE);

    describeReducerV2(History.startTransaction, ({ applyAction }) => {
      it('do not create buffer if one already exists', () => {
        const transactionID = 'transactionID';
        const state = { ...MOCK_STATE, buffer: { id: 'foo', apply: [], revert: [] } };
        const result = applyAction(state, { transactionID });

        expect(result).toBe(state);
      });

      it('create a new transaction buffer', () => {
        const transactionID = 'transactionID';
        const result = applyAction(MOCK_STATE, { transactionID });

        expect(result.buffer).toEqual({ id: transactionID, apply: [], revert: [] });
      });
    });

    describeReducerV2(History.pushTransaction, ({ applyAction }) => {
      const apply = { type: 'apply', payload: null };
      const revert = { type: 'revert', payload: null };
      const transaction = { id: 'transactionID', apply: [apply], revert: [revert] };

      it('merge transaction with active buffer', () => {
        const result = applyAction(
          { ...MOCK_STATE, buffer: { id: 'foo', apply: [{ type: 'old_apply', payload: null }], revert: [{ type: 'old_revert', payload: null }] } },
          { transaction }
        );

        expect(result.buffer).toEqual({
          id: 'foo',
          apply: [{ type: 'old_apply', payload: null }, apply],
          revert: [{ type: 'old_revert', payload: null }, revert],
        });
        expect(result.undo).toEqual(MOCK_STATE.undo);
        expect(result.redo).toEqual(MOCK_STATE.redo);
      });

      it('push transaction directly to undo stack', () => {
        const result = applyAction(MOCK_STATE, { transaction });

        expect(result.buffer).toBeNull();
        expect(result.undo).toEqual([...MOCK_STATE.undo, transaction]);
        expect(result.redo).toEqual([]);
      });
    });

    describeReducerV2(History.flushTransaction, ({ applyAction }) => {
      const transactionID = 'transactionID';

      it('do nothing if no transaction buffer is active', () => {
        const result = applyAction(MOCK_STATE, { transactionID });

        expect(result).toBe(MOCK_STATE);
      });

      it('do nothing if active transaction buffer does not match', () => {
        const state = { ...MOCK_STATE, buffer: { id: 'other_transaction', apply: [], revert: [] } };

        const result = applyAction(state, { transactionID });

        expect(result).toBe(state);
      });

      it('clear buffer if empty', () => {
        const result = applyAction({ ...MOCK_STATE, buffer: { id: transactionID, apply: [], revert: [] } }, { transactionID });

        expect(result.buffer).toBeNull();
      });

      it('flush transaction', () => {
        const apply = { type: 'apply', payload: null };
        const revert = { type: 'revert', payload: null };

        const result = applyAction({ ...MOCK_STATE, buffer: { id: transactionID, apply: [apply], revert: [revert] } }, { transactionID });

        expect(result.buffer).toBeNull();
        expect(result.undo).toEqual([...MOCK_STATE.undo, { id: transactionID, apply: [apply], revert: [revert] }]);
        expect(result.redo).toEqual([]);
      });
    });

    describeReducerV2(History.undoTransaction, ({ applyAction }) => {
      it('do nothing if no matching undo transaction exists', () => {
        const result = applyAction(MOCK_STATE, { transactionID: '100', revertID: '101' });

        expect(result).toBe(MOCK_STATE);
      });

      it('undo transaction', () => {
        const result = applyAction(MOCK_STATE, { transactionID: '2', revertID: '101' });

        expect(result.undo).toEqual([MOCK_STATE.undo[0]]);
        expect(result.redo).toEqual([
          ...MOCK_STATE.redo,
          {
            id: '101',
            apply: [
              { type: 'buzz/x', payload: null },
              { type: 'buzz/y', payload: null },
            ],
            revert: [
              { type: 'bar/a', payload: null },
              { type: 'bar/b', payload: null },
            ],
          },
        ]);
      });
    });

    describeReducerV2(History.redoTransaction, ({ applyAction }) => {
      it('do nothing if no matching redo transaction exists', () => {
        const result = applyAction(MOCK_STATE, { transactionID: '999', revertID: '100' });

        expect(result).toBe(MOCK_STATE);
      });

      it('redo transaction', () => {
        const result = applyAction(MOCK_STATE, { transactionID: '4', revertID: '101' });

        expect(result.redo).toEqual([MOCK_STATE.redo[0]]);
        expect(result.undo).toEqual([
          ...MOCK_STATE.undo,
          {
            id: '101',
            apply: [
              { type: 'fo/1', payload: null },
              { type: 'fo/2', payload: null },
            ],
            revert: [
              { type: 'fee/1', payload: null },
              { type: 'fee/2', payload: null },
            ],
          },
        ]);
      });
    });

    describeReducerV2(History.dropTransactions, ({ applyAction }) => {
      it('remove all matching transactions', () => {
        const result = applyAction(MOCK_STATE, { transactionIDs: ['2', '4'] });

        expect(result.undo).toEqual([MOCK_STATE.undo[0]]);
        expect(result.redo).toEqual([MOCK_STATE.redo[0]]);
      });
    });

    describeReducerV2(Realtime.creator.reset, ({ applyAction }) => {
      it('resets history state on creator reset', () => {
        const result = applyAction(MOCK_STATE);

        expect(result).toEqual(History.INITIAL_STATE);
      });
    });

    describeReducerV2(Realtime.creator.initialize, ({ applyAction }) => {
      it('resets history state on creator initialize', () => {
        const result = applyAction(MOCK_STATE, { ...ACTION_CONTEXT, nodesWithData: [], ports: [], links: [] });

        expect(result).toEqual(History.INITIAL_STATE);
      });
    });
  });

  describe('selectors', () => {
    describe('undoTransactionsSelector()', () => {
      it('select all undo transactions', () => {
        const result = History.undoTransactionsSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.undo);
      });
    });

    describe('redoTransactionsSelector()', () => {
      it('select all redo transactions', () => {
        const result = History.redoTransactionsSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.redo);
      });
    });

    describe('latestUndoTransactionSelector()', () => {
      it('select the most recent undo transaction', () => {
        const result = History.latestUndoTransactionSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.undo[1]);
      });
    });

    describe('latestRedoTransactionSelector()', () => {
      it('select the most recent redo transaction', () => {
        const result = History.latestRedoTransactionSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.redo[1]);
      });
    });
  });

  describe('side effects', () => {
    describeEffectV2(History.transaction, 'transaction()', ({ applyEffect }) => {
      it('bookend operation to establish transaction context', async () => {
        const transactionID = 'xyz';
        const rootState = createState(MOCK_STATE);
        vi.spyOn(Utils.id, 'cuid').mockReturnValue(transactionID);

        const { dispatched } = await applyEffect(rootState, () => {});

        expect(dispatched).toEqual([History.startTransaction({ transactionID }), History.flushTransaction({ transactionID })]);
      });
    });

    describeEffectV2(History.undo, 'undo()', ({ applyEffect }) => {
      it('do nothing if no undo transactions available', async () => {
        const rootState = createState({ ...MOCK_STATE, undo: [] });

        const { dispatched } = await applyEffect(rootState);

        expect(dispatched).toEqual([]);
      });

      it('dispatch actions to apply the most recent undo transaction', async () => {
        const revertID = 'xyz';
        const rootState = createState(MOCK_STATE);
        vi.spyOn(Utils.id, 'cuid').mockReturnValue(revertID);

        const { dispatched } = await applyEffect(rootState);

        expect(dispatched).toEqual([
          { sync: { type: 'bar/a', payload: null, meta: { [REPLAY_KEY]: true } } },
          { sync: { type: 'bar/b', payload: null, meta: { [REPLAY_KEY]: true } } },
          History.undoTransaction({ transactionID: '2', revertID }),
        ]);
      });
    });

    describeEffectV2(History.redo, 'redo()', ({ applyEffect }) => {
      it('do nothing if no redo transactions available', async () => {
        const rootState = createState({ ...MOCK_STATE, redo: [] });

        const { dispatched } = await applyEffect(rootState);

        expect(dispatched).toEqual([]);
      });

      it('dispatch actions to apply the most recent redo transaction', async () => {
        const revertID = 'xyz';
        const rootState = createState(MOCK_STATE);
        vi.spyOn(Utils.id, 'cuid').mockReturnValue(revertID);

        const { dispatched } = await applyEffect(rootState);

        expect(dispatched).toEqual([
          { sync: { type: 'fee/1', payload: null, meta: { [REPLAY_KEY]: true } } },
          { sync: { type: 'fee/2', payload: null, meta: { [REPLAY_KEY]: true } } },
          History.redoTransaction({ transactionID: '4', revertID }),
        ]);
      });
    });
  });
});
