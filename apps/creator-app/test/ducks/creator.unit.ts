import { Utils } from '@voiceflow/common';

import * as Creator from '@/ducks/creator';

import suite from './_suite';

const MOCK_STATE = {
  focus: {
    target: Utils.generate.id(),
    isActive: true,
  } as Creator.FocusState,
  diagramsHistory: [],
};

suite(Creator, MOCK_STATE)('Ducks - Creator', ({ describeReducer }) => {
  describeReducer(
    {
      focus: Creator.INITIAL_FOCUS_STATE,
      diagramsHistory: Creator.INITIAL_DIAGRAMS_HISTORY_STATE,
    },
    ({ expectAction }) => {
      describe('setFocus()', () => {
        const nodeID = Utils.generate.id();

        it('should set focus', () => {
          expectAction(Creator.setFocus(nodeID)).toModify({
            focus: {
              target: nodeID,
              isActive: true,
            },
          });
        });

        it('should not modify state if target already active', () => {
          expectAction(Creator.setFocus(nodeID))
            .withState({
              ...MOCK_STATE,
              focus: {
                target: nodeID,
                isActive: true,
              },
            })
            .toNotModify();
        });
      });

      describe('clearFocus()', () => {
        it('should clear focus', () => {
          expectAction(Creator.clearFocus()).toModify({
            focus: {
              ...MOCK_STATE.focus,
              isActive: false,
            },
          });
        });

        it('should not clear focus if not active', () => {
          expectAction(Creator.clearFocus())
            .withState({
              ...MOCK_STATE,
              focus: {
                ...MOCK_STATE.focus,
                isActive: false,
              },
            })
            .toNotModify();
        });
      });
    }
  );
});
