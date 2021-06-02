import React from 'react';

import SearchableList from '@/components/SearchableList';
import { ROOT_DIAGRAM_NAME } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Container, Item } from './components';

const FlowList: React.FC<ConnectedFlowListProps> = ({ diagrams, rootDiagramID, activeDiagramID }) => {
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
    </Container>
  );
};

const mapStateToProps = {
  diagrams: Diagram.allDiagramsSelector,
  rootDiagramID: Version.activeRootDiagramIDSelector,
  activeDiagramID: Session.activeDiagramIDSelector,
};

type ConnectedFlowListProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(FlowList);
