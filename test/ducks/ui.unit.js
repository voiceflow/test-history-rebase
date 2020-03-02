import { BlockCategoryType, FlowTab } from '@/constants';
import * as UI from '@/ducks/ui';
import { PanelType } from '@/pages/Canvas/components/CanvasMenu/constants';

import suite from './_suite';

const MOCK_STATE = {
  creatorMenu: {
    activeMenu: PanelType.VARIABLE_PANEL,
    isHidden: true,
  },
  blockMenu: {
    openSections: [BlockCategoryType.ADVANCED],
  },
  flowMenu: {
    activeTab: FlowTab.FLOW,
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
        expectAction(UI.setActiveCreatorMenu(PanelType.BLOCK_PANEL)).toModify({
          creatorMenu: {
            activeMenu: PanelType.BLOCK_PANEL,
            isHidden: false,
          },
        });
      });
    });

    describe('setOnlyActiveCreatorMenu()', () => {
      it('should set the active creator menu panel', () => {
        expectAction(UI.setOnlyActiveCreatorMenu(PanelType.BLOCK_PANEL)).toModify({
          creatorMenu: {
            activeMenu: PanelType.BLOCK_PANEL,
            isHidden: true,
          },
        });
      });
    });

    describe('setActiveFlowMenuTab()', () => {
      it('should set the active flow menu tab', () => {
        expectAction(UI.setActiveFlowMenuTab(FlowTab.STRUCTURE)).toModify({
          flowMenu: {
            activeTab: FlowTab.STRUCTURE,
          },
        });
      });
    });

    describe('toggleCreatorMenuHidden()', () => {
      it('should show the creator menu', () => {
        expectAction(UI.toggleCreatorMenuHidden()).toModify({
          creatorMenu: {
            activeMenu: PanelType.VARIABLE_PANEL,
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
              activeMenu: PanelType.VARIABLE_PANEL,
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
        expect(select(UI.activeCreatorMenuSelector)).to.eq(PanelType.VARIABLE_PANEL);
      });
    });

    describe('isCreatorMenuHiddenSelector()', () => {
      it('should select whether the creator menu is hidden', () => {
        expect(select(UI.isCreatorMenuHiddenSelector)).to.be.true;
      });
    });

    describe('activeFlowMenuTabSelector()', () => {
      it('should select the flow menu tab', () => {
        expect(select(UI.activeFlowMenuTabSelector)).to.eq(FlowTab.FLOW);
      });
    });
  });
});
