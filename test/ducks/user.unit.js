import * as User from '@/ducks/user';

import suite from './_suite';

const MOCK_STATE = {
  preview: true,
  canvasError: [{ msg: 'some message', icon: '/icons/something.svg' }],
  tab: 'variables',
  menuOpen: false,
};

suite('Ducks - User', ({ describeReducer }) => {
  describeReducer(User, MOCK_STATE, (utils) => {
    describe('setCanvasError()', () => {
      it('should set a canvas error message', () => {
        const message = 'did not pass spec';

        utils.expectDiff(User.setCanvasError(message), { canvasError: [{ msg: message, icon: '/yellow-error.svg' }] });
      });
    });

    describe('setCanvasInfo()', () => {
      it('should set a canvas info message', () => {
        const message = 'it worked!';

        utils.expectDiff(User.setCanvasInfo(message), { canvasError: [{ msg: message, icon: '/green-check.svg' }] });
      });
    });

    describe('closeCanvasError()', () => {
      it('should clear a canvas message', () => {
        utils.expectDiff(User.closeCanvasError(0), { canvasError: [] });
      });
    });
  });
});
