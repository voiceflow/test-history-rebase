import * as User from '@/ducks/user';

import suite from './_suite';

const MOCK_STATE = {
  preview: true,
  canvasError: [{ msg: 'some message', icon: '/icons/something.svg' }],
  tab: 'variables',
  menuOpen: false,
};

suite(User, MOCK_STATE)('Ducks - User', ({ describeReducer }) => {
  describeReducer(({ expectAction }) => {
    describe('setCanvasError()', () => {
      it('should set a canvas error message', () => {
        const message = 'did not pass spec';

        expectAction(User.setCanvasError(message)).toModify({ canvasError: [{ msg: message, icon: '/yellow-error.svg' }] });
      });
    });

    describe('setCanvasInfo()', () => {
      it('should set a canvas info message', () => {
        const message = 'it worked!';

        expectAction(User.setCanvasInfo(message)).toModify({ canvasError: [{ msg: message, icon: '/green-check.svg' }] });
      });
    });

    describe('closeCanvasError()', () => {
      it('should clear a canvas message', () => {
        expectAction(User.closeCanvasError(0)).toModify({ canvasError: [] });
      });
    });
  });
});
