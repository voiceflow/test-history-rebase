import React from 'react';

import Select from '@/components/Select';
import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';
import { filterIntents, formatIntentName, prettifyIntentName, prettifyIntentNames } from '@/utils/intent';

import { MissingIntentMessage, Option } from './components';

const getOptionValue = (option) => option.id;
const labelRenderer = (option, searchLabel, getOptionLabel, getOptionValue, options) => (
  <Option option={option} searchLabel={searchLabel} getOptionLabel={getOptionLabel} getOptionValue={getOptionValue} options={options} />
);

function IntentSelect({ intent, intents, onChange, newIntent }) {
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
  const intentMissing = intent?.id && !intentLookup[intent?.id] && !intent?.builtIn;

  const getOptionLabel = React.useCallback((value) => intentLookup[value], [intentLookup]);
  const isButtonDisabled = React.useCallback((newName) => filteredIntents.find(({ name }) => name === newName), [filteredIntents]);

  const onSelectIntent = React.useCallback((value) => onChange({ intent: value }), [onChange]);

  const onCreate = React.useCallback(
    (name) => {
      onSelectIntent(newIntent({ name: prettifyIntentName(name) }));
    },
    [newIntent, onSelectIntent]
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
        renderOptionLabel={labelRenderer}
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
  newIntent: Intent.newIntent,
};

const mergeProps = ({ intents }, _, { intents: intentOverrides }) => ({
  intents: intentOverrides || intents,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(IntentSelect);
