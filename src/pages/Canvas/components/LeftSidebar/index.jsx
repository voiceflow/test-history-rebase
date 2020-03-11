import React from 'react';

import * as Diagram from '@/ducks/diagram';
import * as Skill from '@/ducks/skill';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useEnableDisable, useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { CanvasGoHome, CanvasReadOnly } from '@/pages/Canvas/components/CanvasControls/components';
import CanvasControlsV2 from '@/pages/Canvas/components/CanvasControlsV2';
import FlowBar from '@/pages/Canvas/components/FlowBar';
import { EditPermissionContext } from '@/pages/Canvas/contexts';
import { preventDefault } from '@/utils/dom';

import { Container, Content, Flows, Header, Steps } from './components';
import { TABS, Tab } from './constants';

function LeftSidebar({ isHidden, activeTab, flow, isRootDiagram, toggleIsHidden, selectActiveTab }) {
  const { canEdit, isTesting } = React.useContext(EditPermissionContext);
  const selectedTab = React.useMemo(() => (Object.values(Tab).includes(activeTab) ? activeTab : Tab.STEPS), [activeTab]);
  const [isOpenByHover, openByHover, closeByLoseHover] = useEnableDisable(false);
  const showFlowControls = !isTesting && !isRootDiagram && flow;

  useHotKeys(
    Hotkey.OPEN_LEFT_SIDEBAR_FLOWS_TAB,
    preventDefault(() => {
      selectActiveTab(Tab.FLOWS);
      openByHover();
    })
  );

  useHotKeys(
    Hotkey.OPEN_LEFT_SIDEBAR_STEPS_TAB,
    preventDefault(() => {
      selectActiveTab(Tab.STEPS);
      openByHover();
    })
  );

  useHotKeys(Hotkey.TOGGLE_LEFT_SIDEBAR_LOCK, preventDefault(toggleIsHidden));

  const isOpen = (!isHidden || isOpenByHover) && canEdit;

  return (
    <>
      <Container isOpen={isOpen} onMouseEnter={canEdit ? openByHover : null} onMouseLeave={canEdit ? closeByLoseHover : null}>
        <Content isOpen={isOpen} activeTab={selectedTab}>
          <Header tabs={TABS} locked={!isHidden} toggleLock={toggleIsHidden} selectedTab={selectedTab} selectActiveTab={selectActiveTab} />

          {selectedTab === Tab.STEPS && <Steps />}
          {selectedTab === Tab.FLOWS && <Flows isOpen={isOpen} />}
        </Content>
      </Container>

      <CanvasControlsV2 />

      {!canEdit && <CanvasReadOnly />}

      {showFlowControls && (
        <>
          <CanvasGoHome withMenu={false} withDrawer={canEdit} />
          <FlowBar withMenu withDrawer={canEdit} flow={flow} />
        </>
      )}
    </>
  );
}

const mapStateToProps = {
  isHidden: UI.isCreatorMenuHiddenSelector,
  activeTab: UI.activeCreatorMenuSelector,
  activeDiagramID: Skill.activeDiagramIDSelector,
  isRootDiagram: Skill.isRootDiagramSelector,
  flow: Diagram.flowStructureSelector,
};

const mapDispatchToProps = {
  toggleIsHidden: UI.toggleCreatorMenuHidden,
  selectActiveTab: UI.setOnlyActiveCreatorMenu,
};

const mergeProps = ({ flow: getFlowStructure, activeDiagramID }) => ({
  flow: getFlowStructure(activeDiagramID),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LeftSidebar);
