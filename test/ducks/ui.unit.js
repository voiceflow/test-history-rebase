import { BlockCategoryType } from '@/constants';
import * as UI from '@/ducks/ui';
import { Tab } from '@/pages/Canvas/components/LeftSidebar/constants';

import suite from './_suite';

const MOCK_STATE = {
  creatorMenu: {
    activeMenu: Tab.FLOWS,
    isHidden: true,
  },
  blockMenu: {
    openSections: [BlockCategoryType.ADVANCED],
  },
  local: {},
};

suite(UI, MOCK_STATE)('Ducks - UI', ({ expect, describeReducer, describeSelectors }) => {
  describeReducer(({ expectAction }) => {
    describe('toggleBlockMenuSection()', () => {
      it('should add section if not open', () => {
        expectAction(UI.toggleBlockMenuSection(BlockCategoryType.LOGIC)).toModify({
          blockMenu: {
            openSections: [BlockCategoryType.ADVANCED, BlockCategoryType.LOGIC],
          },
        });
      });

      it('should remove section if already open', () => {
        expectAction(UI.toggleBlockMenuSection(BlockCategoryType.ADVANCED)).toModify({
          blockMenu: {
            openSections: [],
          },
        });
      });
    });

    describe('setActiveCreatorMenu()', () => {
      it('should open the creator menu and set active panel', () => {
        expectAction(UI.setActiveCreatorMenu(Tab.STEPS)).toModify({
          creatorMenu: {
            activeMenu: Tab.STEPS,
            isHidden: true,
          },
        });
      });
    });

    describe('toggleCreatorMenuHidden()', () => {
      it('should show the creator menu', () => {
        expectAction(UI.toggleCreatorMenuHidden()).toModify({
          creatorMenu: {
            activeMenu: Tab.FLOWS,
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
              activeMenu: Tab.FLOWS,
              isHidden: true,
            },
          });
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('openBlockMenuSectionsSelector()', () => {
      it('should select the open block menu sections', () => {
        expect(select(UI.openBlockMenuSectionsSelector)).to.eql([BlockCategoryType.ADVANCED]);
      });
    });

    describe('activeCreatorMenuSelector()', () => {
      it('should select the active creator menu', () => {
        expect(select(UI.activeCreatorMenuSelector)).to.eq(Tab.FLOWS);
      });
    });

    describe('isCreatorMenuHiddenSelector()', () => {
      it('should select whether the creator menu is hidden', () => {
        expect(select(UI.isCreatorMenuHiddenSelector)).to.be.true;
      });
    });
  });
});
