import cuid from 'cuid';
import React from 'react';

import Select from '@/componentsV2/Select';
import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';
import { filterIntents, formatIntentName, prettifyIntentName, prettifyIntentNames } from '@/utils/intent';

import { MissingIntentMessage } from './components';

const getOptionValue = (option) => option.id;

function IntentSelect({ intent, intents, onChange, addIntent }) {
  const intentID = intent?.id;

  const filteredIntents = React.useMemo(() => prettifyIntentNames(filterIntents(intents, intent)), [intents, intent]);
  const intentLookup = React.useMemo(
    () =>
      filteredIntents.reduce((acc, intent) => {
        acc[intent.id] = intent.name;

        return acc;
      }, {}),
    [filteredIntents]
  );
  const intentMissing = intent?.id && !intentLookup[(intent?.id)] && !intent?.builtIn;

  const getOptionLabel = React.useCallback((value) => intentLookup[value], [intentLookup]);
  const isButtonDisabled = React.useCallback((newName) => filteredIntents.find(({ name }) => name === newName), [filteredIntents]);

  const onSelectIntent = React.useCallback((value) => onChange({ intent: value }), [onChange]);

  const onCreate = React.useCallback(
    (name) => {
      const id = cuid.slug();

      onSelectIntent(id);

      addIntent(id, { id, name: prettifyIntentName(name) });
    },
    [addIntent, onSelectIntent]
  );

  return (
    <>
      <Select
        value={intentID}
        clearable={intentID}
        options={filteredIntents}
        onCreate={onCreate}
        onSelect={onSelectIntent}
        formatValue={formatIntentName}
        creatable
        searchable
        placeholder="Name new intent or select existing intent"
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        isButtonDisabled={isButtonDisabled}
        createInputPlaceholder="Name new intent"
      />
      {intentMissing && <MissingIntentMessage variant="warning" message="Intent is broken or has been deleted." />}
    </>
  );
}

const mapStateToProps = {
  intents: Intent.allPlatformIntentsSelector,
};

const mapDispatchToProps = {
  addIntent: Intent.addIntent,
};

const mergeProps = ({ intents }, _, { intents: intentOverrides }) => ({
  intents: intentOverrides || intents,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(IntentSelect);
