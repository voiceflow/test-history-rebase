import React from 'react';

import SearchableList from '@/components/SearchableList';
import { ROOT_DIAGRAM_NAME } from '@/constants';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

import { Container, Item } from './components';

const sortDiagramAlphabetical = (rootDiagramID: string | null, diagram1: any, diagram2: any) => {
  // Keep HOME flow first in list
  if (diagram1.id === rootDiagramID) return -1;
  if (diagram2.id === rootDiagramID) return 1;

  if (diagram1.name.toLowerCase() > diagram2.name.toLowerCase()) {
    return 1;
  }
  if (diagram1.name.toLowerCase() === diagram2.name.toLowerCase()) {
    return 0;
  }
  return -1;
};

const FlowList: React.FC<ConnectedFlowListProps> = ({ diagrams, rootDiagramID, activeDiagramID }) => {
  const sortedDiagrams = React.useMemo(
    () =>
      diagrams
        .sort((diagram1, diagram2) => sortDiagramAlphabetical(rootDiagramID, diagram1, diagram2))
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
  diagrams: DiagramV2.allDiagramsSelector,
  rootDiagramID: VersionV2.active.rootDiagramIDSelector,
  activeDiagramID: Session.activeDiagramIDSelector,
};

type ConnectedFlowListProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(FlowList);
