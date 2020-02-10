import React from 'react';
import { Tooltip } from 'react-tippy';
import { withTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import { activeCreatorMenuSelector, isCreatorMenuHiddenSelector, setActiveCreatorMenu, toggleCreatorMenuHidden } from '@/ducks/ui';
import { connect } from '@/hocs';
import BlockMenu from '@/pages/Canvas/components/BlockMenu';
import CanvasControls from '@/pages/Canvas/components/CanvasControls';
import CanvasReadOnly from '@/pages/Canvas/components/CanvasControls/components/CanvasReadOnly';
import FlowMenu from '@/pages/Canvas/components/FlowMenu';
import VariableMenu from '@/pages/Canvas/components/VariableMenu';
import { EditPermissionContext } from '@/pages/Canvas/contexts';
import { stopImmediatePropagation } from '@/utils/dom';
import { compose } from '@/utils/functional';

import { MenuActionContainer, MenuContainer, MenuContent, MenuHandle, TabIcon } from './components';
import { PanelType } from './constants';

const PANELS = {
  [PanelType.BLOCK_PANEL]: BlockMenu,
  [PanelType.FLOW_PANEL]: FlowMenu,
  [PanelType.VARIABLE_PANEL]: VariableMenu,
};

const Tabs = [
  {
    type: PanelType.BLOCK_PANEL,
    tip: 'Blocks',
    icon: 'blocks',
  },
  {
    type: PanelType.FLOW_PANEL,
    tip: 'Flows',
    icon: 'flows',
  },
  {
    type: PanelType.VARIABLE_PANEL,
    tip: 'Variables',
    icon: 'variable',
  },
];

function CanvasMenu({ activePanel, selectPanel, isHidden, toggleHidden, theme }) {
  const { canEdit } = React.useContext(EditPermissionContext);
  const activeTab = activePanel || PanelType.BLOCK_PANEL;
  const Panel = PANELS[activeTab];
  const isOpen = !isHidden && canEdit;

  const changePanel = (panel) => () => selectPanel(panel);

  return (
    <>
      <Drawer
        as="section"
        open={isOpen}
        width={theme.components.menuDrawer.width + theme.components.menuBar.width}
        onPaste={stopImmediatePropagation()}
      >
        <MenuContainer>
          <MenuContent isHidden={isHidden}>
            {isOpen && (
              <>
                <MenuActionContainer>
                  {Tabs.map(({ type, tip, icon }) => (
                    <Tooltip key={type} title={tip} disabled={type === activeTab} position="right">
                      <TabIcon onClick={changePanel(type)} icon={icon} active={type === activeTab} />
                    </Tooltip>
                  ))}
                </MenuActionContainer>
                <MenuActionContainer>
                  <a href="//www.facebook.com/groups/199476704186240/" target="_blank" rel="noopener noreferrer">
                    <Tooltip title="Community" position="right">
                      <TabIcon icon="community" />
                    </Tooltip>
                  </a>
                  <a href="//forum.voiceflow.com" target="_blank" rel="noopener noreferrer">
                    <Tooltip title="Forum" position="right">
                      <TabIcon icon="support" />
                    </Tooltip>
                  </a>
                  <a href="//docs.voiceflow.com" target="_blank" rel="noopener noreferrer">
                    <Tooltip title="Docs" position="right">
                      <TabIcon icon="docs" />
                    </Tooltip>
                  </a>
                </MenuActionContainer>
              </>
            )}
          </MenuContent>
          {Panel && <Panel isHidden={!canEdit || isHidden} />}
          <MenuHandle isHidden={!canEdit || isHidden} onClick={toggleHidden} />
        </MenuContainer>
      </Drawer>
      {!canEdit && <CanvasReadOnly />}
      <CanvasControls withMenu={isOpen} withDrawer={canEdit} />
    </>
  );
}

const mapStateToProps = {
  activePanel: activeCreatorMenuSelector,
  isHidden: isCreatorMenuHiddenSelector,
};

const mapDispatchToProps = {
  selectPanel: setActiveCreatorMenu,
  toggleHidden: toggleCreatorMenuHidden,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withTheme)(CanvasMenu);
