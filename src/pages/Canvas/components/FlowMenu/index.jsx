import React from 'react';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import Panel, { Content as PanelContent, Section as PanelSection } from '@/components/Panel';
import { FlowTab } from '@/constants';
import * as Realtime from '@/ducks/realtime';
import { activeDiagramIDSelector } from '@/ducks/skill';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';

import FlowList from './components/FlowList';
import FlowStructure from './components/FlowStructure';

const FLOW_ROUTES = [
  {
    label: 'Finder',
    value: FlowTab.STRUCTURE,
    component: FlowStructure,
  },
  {
    label: 'List',
    value: FlowTab.FLOW,
    component: FlowList,
  },
];

const FlowMenu = ({ isHidden, onClose, setActiveTab, activeTab, activeDiagram }) => {
  const [scrollNode, setScrollNode] = React.useState(null);

  return (
    <>
      <Panel title="Flows" onClose={onClose}>
        <PanelContent ref={setScrollNode}>
          {!!scrollNode && (
            <ButtonGroupRouter
              routes={FLOW_ROUTES}
              selected={activeTab}
              onChange={setActiveTab}
              routeProps={{ scrollNode }}
              containerComponent={PanelSection}
            />
          )}
        </PanelContent>
      </Panel>
      <LockedResourceOverlay key={activeDiagram} type={Realtime.ResourceType.FLOWS} disabled={isHidden} />
    </>
  );
};

const mapStateToProps = {
  activeTab: UI.activeFlowMenuTabSelector,
  activeDiagram: activeDiagramIDSelector,
};

const mapDispatchToProps = {
  setActiveTab: UI.setActiveFlowMenuTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(FlowMenu);
