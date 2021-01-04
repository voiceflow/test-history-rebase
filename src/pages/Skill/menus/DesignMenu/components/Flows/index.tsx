import React from 'react';

import SearchableList from '@/components/SearchableList';
import { ROOT_DIAGRAM_NAME } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Container, Item } from './components';

type FlowListProps = {
  isOpen?: boolean;
};

const FlowList: React.FC<FlowListProps & ConnectedFlowListProps> = ({ isOpen, diagrams, rootDiagramID, activeDiagramID }) => {
  const sortedDiagrams = React.useMemo(
    () =>
      diagrams
        .sort(({ id }) => (id === rootDiagramID ? -1 : 0))
        .map((diagram) => ({
          ...diagram,
          name: diagram.id === rootDiagramID ? 'Home' : diagram.name,
        })),
    [diagrams, rootDiagramID]
  );

  const getLabel = React.useCallback((item) => (item.name === ROOT_DIAGRAM_NAME ? 'Home' : item.name), []);

  const renderItem = React.useCallback((item) => <Item {...item} isActive={activeDiagramID === item.id} />, [activeDiagramID]);

  return (
    <Container>
      <SearchableList id={Identifier.FLOW_MENU} items={sortedDiagrams} renderItem={renderItem} getLabel={getLabel} placeholder="Search Flows" />

      <LockedResourceOverlay key={activeDiagramID} type={Realtime.ResourceType.FLOWS} disabled={!isOpen} />
    </Container>
  );
};

const mapStateToProps = {
  diagrams: Diagram.allDiagramsSelector,
  rootDiagramID: Skill.rootDiagramIDSelector,
  activeDiagramID: Skill.activeDiagramIDSelector,
};

type ConnectedFlowListProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(FlowList) as React.FC<FlowListProps>;
