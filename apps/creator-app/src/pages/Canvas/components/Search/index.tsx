import { BaseModels } from '@voiceflow/base-types';
import { Flex, KeyName, OverflowText, SvgIcon, useDebouncedCallback, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { CMSRoute } from '@/config/routes';
import { SearchContext, SearchTypes, SearchUtils } from '@/contexts/SearchContext';
import * as Creator from '@/ducks/creatorV2';
import * as Designer from '@/ducks/designer';
import * as Diagram from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector, useStore, useTrackingEvents } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { withKeyPress } from '@/utils/dom';

import { Container, Control, Dropdown, Input, Menu, Option, Select } from './components';
import type { SearchOption } from './types';

const SearchBar: React.FC = () => {
  const [trackingEvents] = useTrackingEvents();

  const engine = React.useContext(EngineContext);
  const search = React.useContext(SearchContext);
  const [query, setQuery] = React.useState('');
  const deferredQuery = React.useDeferredValue(query);

  const goToDiagram = useDispatch(Router.goToDiagram);
  const goToCMSResource = useDispatch(Router.goToCMSResource);

  const diagramID = useSelector(Creator.activeDiagramIDSelector)!;
  const store = useStore();
  const database = React.useRef<SearchTypes.SearchDatabase>(SearchUtils.EmptySearchDatabase);

  const isVisible = !!search?.isVisible;

  const onChange = (option: SearchOption | null) => {
    search?.hide();

    if (!option) return;

    const { entry } = option;

    if (SearchUtils.isEntityDatabaseEntry(entry)) {
      goToCMSResource(CMSRoute.ENTITY, entry.entityID);
    } else if (SearchUtils.isIntentDatabaseEntry(entry)) {
      goToCMSResource(CMSRoute.INTENT, entry.intentID);
    } else if (SearchUtils.isDiagramDatabaseEntry(entry)) {
      goToDiagram(entry.diagramID);
    } else if (SearchUtils.isNodeDatabaseEntry(entry)) {
      if (entry.diagramID !== diagramID) {
        goToDiagram(entry.diagramID, entry.nodeID);
      } else {
        engine?.focusNode(entry.nodeID, { open: true, focusOnStep: true });
      }
    }

    trackingEvents.trackSearchBarResultSelected({
      query,
      selected: entry.targets[0],
      resultListSize: options.length,
    });
  };

  const createOption = usePersistFunction(
    (query: string): SearchUtils.CreateOption<SearchOption & { index: number }> =>
      ({ target, index, entry }) => {
        const afterQuery = index + query.length;
        const start = Math.max(index - 10, 0);

        return {
          label: (
            <Flex>
              <SvgIcon icon={SearchUtils.getDatabaseEntryIcon(entry)} color="#F2F7F7D9" mb={-2} mr={12} />
              <OverflowText>
                {start > 0 && '...'}
                {target.substring(start, index).trimStart()}
                <b>{target.substring(index, afterQuery)}</b>
                {target.substring(afterQuery)}
              </OverflowText>
            </Flex>
          ),
          entry,
          index,
        };
      }
  );

  const options = React.useMemo(
    () => SearchUtils.find(deferredQuery, database.current, createOption(deferredQuery), search?.filters),
    [deferredQuery, search?.filters]
  );

  const onKeyStroke = useDebouncedCallback(3000, () => {
    trackingEvents.trackSearchBarQuery({ query });
  });

  const onInputChange = (value: string) => {
    setQuery(value);
    onKeyStroke();
  };

  // rebuild the database every time search is opened
  React.useEffect(() => {
    if (!search?.isVisible) return;

    const state = store.getState();
    const entities = Designer.Entity.selectors.allWithVariants(state);
    const nodeData = Creator.allNodeDataSelector(state);
    const diagrams = Diagram.allDiagramsSelector(state).filter(
      ({ type }) => type !== BaseModels.Diagram.DiagramType.TEMPLATE
    );

    database.current[SearchTypes.SearchCategory.NODE] = search.syncNodeDatabases({
      [diagramID]: SearchUtils.buildNodeDatabase(nodeData, diagramID, state),
    });
    database.current[SearchTypes.SearchCategory.INTENT] = SearchUtils.buildIntentDatabase(state);
    database.current[SearchTypes.SearchCategory.ENTITIES] = SearchUtils.buildEntityDatabase(entities);
    Object.assign(database.current, SearchUtils.buildDiagramDatabases(diagrams));
  }, [search?.isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <Container ref={search.searchBarRef}>
      <Select
        options={options}
        onChange={onChange}
        autoFocus
        components={{ Menu, Input, Control, IndicatorsContainer: Dropdown, Option }}
        onKeyDown={withKeyPress(KeyName.ESCAPE, () => search?.hide())}
        filterOption={null}
        placeholder="Find anything..."
        onInputChange={onInputChange}
        maxMenuHeight={124}
        classNamePrefix="search"
      />
    </Container>
  );
};

export default SearchBar;
