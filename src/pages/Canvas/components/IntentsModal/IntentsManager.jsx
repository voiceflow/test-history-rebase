import cuid from 'cuid';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';
import { reorder as reorderArray } from '@/utils/array';
import { formatIntentName } from '@/utils/intent';
import { convertToWord } from '@/utils/number';

import {
  AddIntentButton,
  Container,
  DraggableItem,
  IntentContainer,
  IntentSection,
  ListActionsContainer,
  ListContainer,
  ListSection,
  SearchContainer,
  SearchInput,
} from './components';

const NEW_INTENT_NAME = 'intent';

const IntentManager = ({ intents, intentsIDs, removeIntent, reorder, addIntent }) => {
  const [selectedIntentID, setSelectedIntentID] = React.useState(intents[0]?.id);
  const [search, setSearch] = React.useState('');

  const containerRef = React.useRef();

  const scrollTo = React.useCallback((...args) => containerRef.current.scrollTo(...args), []);
  const scrollToBottom = React.useCallback((behavior = 'smooth') => scrollTo({ top: containerRef.current.scrollHeight, behavior }), [scrollTo]);

  const filter = (item) => item.name.toLowerCase().includes(search.toLowerCase());
  const reorderIntents = (from, to) => {
    const newArray = reorderArray(intentsIDs, from, to);
    reorder(newArray);
  };

  const addNewIntent = async () => {
    const id = cuid.slug();
    let counter = 1;
    const intentNames = intents.map(({ name }) => name);

    while (intentNames.includes(`${NEW_INTENT_NAME}_${convertToWord(counter)}`)) {
      counter++;
    }
    const newName = `${NEW_INTENT_NAME}_${convertToWord(counter)}`;

    await addIntent(id, { id, name: newName });
    scrollToBottom();
    setSelectedIntentID(id);
  };

  return (
    <Container>
      <ListSection column>
        <ListActionsContainer>
          <SearchContainer>
            <SearchInput
              icon="search"
              iconProps={{ color: '#8da2b5' }}
              placeholder="Search..."
              value={search}
              onChange={({ target }) => setSearch(formatIntentName(target.value))}
            />
          </SearchContainer>
          <AddIntentButton onClick={addNewIntent}>Add New Intent</AddIntentButton>
        </ListActionsContainer>
        <ListContainer ref={containerRef}>
          <DraggableList
            type="intents"
            items={intents}
            filter={filter}
            onDelete={(_, intent) => {
              removeIntent(intent.item.id);
            }}
            onReorder={reorderIntents}
            itemProps={{ selectedIntentID, setSelectedIntentID }}
            getItemKey={(item) => item.id}
            itemComponent={DraggableItem}
            deleteComponent={DeleteComponent}
            previewComponent={DraggableItem}
            withContextMenuDelete
          />
        </ListContainer>
      </ListSection>
      <IntentSection>
        <IntentContainer intentID={selectedIntentID} />
      </IntentSection>
    </Container>
  );
};

const mapStateToProps = {
  intents: Intent.allIntentsSelector,
  intentsMap: Intent.mapIntentsSelector,
  intentsIDs: Intent.allIntentIDsSelector,
};

const mapDispatchToProps = {
  removeIntent: Intent.removeIntent,
  reorder: Intent.reorderIntents,
  addIntent: Intent.addIntent,
};

export default connect(mapStateToProps, mapDispatchToProps)(IntentManager);
