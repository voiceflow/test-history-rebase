import { Flex, KeyName, OverflowText, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { SearchContext, SearchTypes, SearchUtils } from '@/contexts/SearchContext';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creatorV2';
import * as Diagram from '@/ducks/diagramV2';
import * as Intent from '@/ducks/intentV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slotV2';
import { useDebouncedCallback, useDispatch, useSelector, useStore, useTrackingEvents } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { withKeyPress } from '@/utils/dom';

import { Container, Control, Dropdown, Input, Menu, Select } from './components';

interface SearchOption {
  label: React.ReactNode;
  entry: SearchTypes.DatabaseEntry;
}

const SearchBar: React.FC = () => {
  const [trackingEvents] = useTrackingEvents();

  const engine = React.useContext(EngineContext);
  const search = React.useContext(SearchContext);
  const [query, setQuery] = React.useState('');
  const goToDiagram = useDispatch(Router.goToDiagram);
  const goToIMEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const diagramID = useSelector(Creator.activeDiagramIDSelector)!;
  const creatorID = useSelector(Account.userIDSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const store = useStore();
  const database = React.useRef<SearchTypes.SearchDatabase>(SearchUtils.EmptySearchDatabase);

  const isVisible = !!search?.isVisible;

  // rebuild the database every time search is opened
  React.useEffect(() => {
    if (!search?.isVisible) return;

    const state = store.getState();
    const intents = Intent.allCustomIntentsSelector(state);
    const slots = Slot.allSlotsSelector(state);
    const nodeData = Creator.allNodeDataSelector(state);
    const diagrams = Diagram.allDiagramsSelector(state);

    database.current[SearchTypes.SearchCategory.NODE] = search.syncNodeDatabases({
      [diagramID]: SearchUtils.buildNodeDatabase(nodeData, diagramID, state),
    });
    database.current[SearchTypes.SearchCategory.INTENT] = SearchUtils.buildIntentDatabase(intents);
    database.current[SearchTypes.SearchCategory.ENTITIES] = SearchUtils.buildSlotDatabase(slots);
    Object.assign(database.current, SearchUtils.buildDiagramDatabases(diagrams));
  }, [search?.isVisible]);

  const onChange = React.useCallback(
    ({ entry }: SearchOption) => {
      search?.hide();

      if (SearchUtils.isIntentDatabaseEntry(entry)) {
        goToIMEntity(InteractionModelTabType.INTENTS, entry.intentID);
      } else if (SearchUtils.isSlotDatabaseEntry(entry)) {
        goToIMEntity(InteractionModelTabType.SLOTS, entry.slotID);
      } else if (SearchUtils.isDiagramDatabaseEntry(entry)) {
        goToDiagram(entry.diagramID);
      } else if (SearchUtils.isNodeDatabaseEntry(entry)) {
        if (entry.diagramID !== diagramID) {
          goToDiagram(entry.diagramID, entry.nodeID);
        } else {
          engine?.focusNode(entry.nodeID, { open: true });
        }
      }

      trackingEvents.trackSearchBarResultSelected({
        creator_id: creatorID,
        workspace_id: workspaceID,
        project_id: projectID,
        query,
        resultList: options,
        selected: entry.targets[0],
      });
    },
    [diagramID, query]
  );

  const createOption = React.useCallback(
    (query: string): SearchUtils.CreateOption<SearchOption> =>
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
        };
      },
    []
  );

  const options = React.useMemo(() => SearchUtils.find(query, database.current, createOption(query), search?.filters), [query, search?.filters]);

  const onKeyStroke = useDebouncedCallback(1000, () => {
    trackingEvents.trackSearchBarQuery({
      query,
      creator_id: creatorID,
      workspace_id: workspaceID,
      project_id: projectID,
    });
  });

  if (!isVisible) {
    return null;
  }

  return (
    <Container ref={search.searchBarRef}>
      <Select
        filterOption={null}
        options={options}
        onChange={onChange}
        onInputChange={(value: string) => {
          setQuery(value);
          onKeyStroke();
        }}
        components={{
          Input,
          Control,
          IndicatorsContainer: Dropdown,
          Menu,
        }}
        autoFocus
        onKeyDown={withKeyPress(KeyName.ESCAPE, () => search?.hide())}
        placeholder="Find anything..."
        maxMenuHeight={124}
        classNamePrefix="search"
      />
    </Container>
  );
};

export default SearchBar;
