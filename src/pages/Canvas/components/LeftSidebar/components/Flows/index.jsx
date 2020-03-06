import _toLower from 'lodash/toLower';
import React from 'react';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';

import CustomScrollbars from '@/components/CustomScrollbars';
import { ROOT_DIAGRAM_NAME } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';

import { Container, Item, ScrollContainer, SearchContainer, SearchInput, WindowScrollerContainer } from './components';

const FlowList = ({ isOpen, diagrams, activeDiagramID }) => {
  const [scrollbars, setCustomScrollBars] = React.useState();
  const [searchValue, setSearchValue] = React.useState('');

  const filteredDiagrams = React.useMemo(
    () =>
      diagrams.filter((diagram) => {
        const name = _toLower(diagram.name === ROOT_DIAGRAM_NAME ? 'Home' : diagram.name);

        return name.includes(_toLower(searchValue).trim());
      }),
    [diagrams, searchValue]
  );

  const rowRenderer = React.useCallback(
    ({ key, index, style }) => (
      <div key={key} style={style}>
        <Item {...filteredDiagrams[index]} isActive={activeDiagramID === filteredDiagrams[index].id} />
      </div>
    ),
    [filteredDiagrams, activeDiagramID]
  );

  return (
    <Container>
      <ScrollContainer>
        <CustomScrollbars ref={setCustomScrollBars}>
          {!scrollbars ? null : (
            <WindowScrollerContainer>
              <WindowScroller scrollElement={scrollbars.view}>
                {({ height, isScrolling, registerChild, scrollTop }) =>
                  !!height && (
                    <AutoSizer disableHeight={true}>
                      {({ width }) => (
                        <div ref={registerChild}>
                          <List
                            width={width}
                            height={height}
                            scrollTop={scrollTop}
                            rowCount={filteredDiagrams.length}
                            rowHeight={42}
                            autoHeight
                            rowRenderer={rowRenderer}
                            isScrolling={isScrolling}
                          />
                        </div>
                      )}
                    </AutoSizer>
                  )
                }
              </WindowScroller>
            </WindowScrollerContainer>
          )}
        </CustomScrollbars>
      </ScrollContainer>

      <SearchContainer>
        <SearchInput
          icon="search"
          value={searchValue}
          onChange={({ target }) => setSearchValue(target.value)}
          iconProps={{ color: '#8da2b5' }}
          placeholder="Search flows"
        />
      </SearchContainer>

      <LockedResourceOverlay key={activeDiagramID} type={Realtime.ResourceType.FLOWS} disabled={!isOpen} />
    </Container>
  );
};

const mapStateToProps = {
  diagrams: Diagram.allDiagramsSelector,
  activeDiagramID: Skill.activeDiagramIDSelector,
};

export default connect(mapStateToProps)(FlowList);
