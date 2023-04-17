import { ControlScheme } from '@/components/Canvas/constants';
import { BlockCategory } from '@/constants';
import * as UI from '@/ducks/ui';

import suite from './_suite';

const MOCK_STATE = {
  creatorMenu: {
    isHidden: true,
  },
  blockMenu: {
    openSections: [BlockCategory.USER_INPUT],
  },
  local: {},
  canvasOnly: false,
  canvasNavigation: ControlScheme.MOUSE,
  _persist: { version: 1, rehydrated: false },
};

suite(UI, MOCK_STATE)('Ducks - UI', ({ describeReducer, describeSelectors }) => {
  describeReducer(({ expectAction }) => {
    describe('toggleBlockMenuSection()', () => {
      it('should add section if not open', () => {
        expectAction(UI.toggleBlockMenuSection(BlockCategory.LOGIC)).toModify({
          blockMenu: {
            openSections: [BlockCategory.USER_INPUT, BlockCategory.LOGIC],
          },
        });
      });

      it('should remove section if already open', () => {
        expectAction(UI.toggleBlockMenuSection(BlockCategory.USER_INPUT)).toModify({
          blockMenu: {
            openSections: [],
          },
        });
      });
    });

    describe('toggleCreatorMenuHidden()', () => {
      it('should show the creator menu', () => {
        expectAction(UI.toggleCreatorMenuHidden()).toModify({
          creatorMenu: {
            isHidden: false,
          },
        });
      });

      it('should hide the creator menu', () => {
        const menuVisibleState = { ...MOCK_STATE, creatorMenu: { ...MOCK_STATE.creatorMenu, isHidden: false } };

        expectAction(UI.toggleCreatorMenuHidden())
          .withState(menuVisibleState)
          .toModify({
            creatorMenu: {
              isHidden: true,
            },
          });
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('openBlockMenuSectionsSelector()', () => {
      it('should select the open block menu sections', () => {
        expect(select(UI.openBlockMenuSectionsSelector)).toEqual([BlockCategory.USER_INPUT]);
      });
    });

    describe('isCreatorMenuHiddenSelector()', () => {
      it('should select whether the creator menu is hidden', () => {
        expect(select(UI.isCreatorMenuHiddenSelector)).toBeTruthy();
      });
    });
  });
});
