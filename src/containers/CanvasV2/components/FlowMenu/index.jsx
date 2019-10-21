import React from 'react';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import Panel, { Content as PanelContent, Section as PanelSection } from '@/components/Panel';
import { FlowTab } from '@/constants';
import { activeFlowMenuTabSelector, setActiveFlowMenuTab } from '@/ducks/ui';
import { connect } from '@/hocs';

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

const FlowMenu = ({ onClose, setActiveTab, activeTab }) => (
  <Panel title="Flows" onClose={onClose}>
    <PanelContent>
      <ButtonGroupRouter selected={activeTab} onChange={setActiveTab} routes={FLOW_ROUTES} containerComponent={PanelSection} />
    </PanelContent>
  </Panel>
);

const mapStateToProps = {
  activeTab: activeFlowMenuTabSelector,
};

const mapDispatchToProps = {
  setActiveTab: setActiveFlowMenuTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlowMenu);
