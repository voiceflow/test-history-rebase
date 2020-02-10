import _toLower from 'lodash/toLower';
import _trim from 'lodash/trim';
import React from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import { Input } from 'reactstrap';

import { ROOT_DIAGRAM_NAME } from '@/constants';
import { allDiagramsSelector } from '@/ducks/diagram';
import { connect, styled } from '@/hocs';

import FlowButton from './FlowButton';
import SectionTitle from './SectionTitle';

export const SearchSection = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;

const FlowList = ({ diagrams, scrollNode }) => {
  const [filter, setFilter] = React.useState('');
  const updateFilter = ({ target }) => setFilter(target.value);

  const diagramsToRender = diagrams.filter((diagram) => {
    const name = _toLower(diagram.name === ROOT_DIAGRAM_NAME ? 'Home' : diagram.name);

    return name.includes(_toLower(_trim(filter)));
  });

  const rowRenderer = React.useCallback(
    ({ key, index, style }) => (
      <div key={key} style={style}>
        <FlowButton {...diagramsToRender[index]} />
      </div>
    ),
    [diagramsToRender]
  );

  return (
    <WindowScroller scrollElement={scrollNode}>
      {({ height, isScrolling, registerChild, scrollTop }) =>
        !!height && (
          <AutoSizer disableHeight={true}>
            {({ width }) => (
              <div style={{ width }}>
                <SectionTitle className="mt-1">All Flows</SectionTitle>
                <SearchSection>
                  <Input placeholder="Search Flows" name="filter" value={filter} onChange={updateFilter} className="mb-2 search-input" />
                </SearchSection>

                <div ref={registerChild} className="flows-list">
                  <List
                    width={width}
                    height={height}
                    scrollTop={scrollTop}
                    rowCount={diagramsToRender.length}
                    rowHeight={42}
                    autoHeight
                    rowRenderer={rowRenderer}
                    isScrolling={isScrolling}
                  />
                </div>
              </div>
            )}
          </AutoSizer>
        )
      }
    </WindowScroller>
  );
};

const mapStateToProps = {
  diagrams: allDiagramsSelector,
};

export default connect(mapStateToProps)(FlowList);
