import _shuffle from 'lodash/shuffle';
import _toLower from 'lodash/toLower';
import React from 'react';

import Select from '@/components/Select';
import { SPACE_REGEXP } from '@/constants';
import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';
import { filterIntents, formatIntentName, prettifyIntentName, prettifyIntentNames } from '@/utils/intent';
import { removeTrailingUnderscores } from '@/utils/string';

import { MissingIntentMessage, Option } from './components';

const getOptionValue = (option) => option.id;
const labelRenderer = (option, searchLabel, getOptionLabel, getOptionValue, options) => (
  <Option option={option} searchLabel={searchLabel} getOptionLabel={getOptionLabel} getOptionValue={getOptionValue} options={options} />
);

const optionsFilter = (options, searchLabel, { maxSize = options.length, getOptionLabel, getOptionValue } = {}) => {
  const [matchedOptions, notMatchedOptions] = options.reduce(
    ([matched, notMatched], option) => {
      if (
        !searchLabel ||
        _toLower(getOptionLabel(getOptionValue(option)))
          .replace(SPACE_REGEXP, '_')
          .includes(_toLower(searchLabel))
      ) {
        matched.push(option);
      } else {
        notMatched.push(option);
      }

      return [matched, notMatched];
    },
    [[], []]
  );

  let filteredOptions = matchedOptions;

  if (matchedOptions.length > maxSize) {
    filteredOptions = matchedOptions.slice(0, maxSize);
  } else if (matchedOptions.length < maxSize) {
    filteredOptions = [...matchedOptions, ...(searchLabel ? _shuffle(notMatchedOptions) : notMatchedOptions)].slice(0, maxSize);
  }

  return { filteredOptions, matchedOptions, notMatchedOptions };
};

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
  const isButtonDisabled = React.useCallback(
    (newName) => filteredIntents.find(({ name }) => _toLower(name).replace(SPACE_REGEXP, '_') === _toLower(newName)),
    [filteredIntents]
  );

  const onSelectIntent = React.useCallback((value) => onChange({ intent: value }), [onChange]);

  const onCreate = React.useCallback(
    (name) => {
      const preparedName = removeTrailingUnderscores(prettifyIntentName(name));
      const intent = filteredIntents.find(({ name }) => removeTrailingUnderscores(name) === preparedName);

      onSelectIntent(intent ? intent.id : newIntent({ name: preparedName }));
    },
    [newIntent, intentLookup, onSelectIntent]
  );

  return (
    <>
      <Select
        value={intentID}
        clearable={intentID}
        options={filteredIntents}
        onCreate={onCreate}
        onSelect={onSelectIntent}
        creatable
        searchable
        placeholder="Name new intent or select existing intent"
        optionsFilter={optionsFilter}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        formatInputValue={formatIntentName}
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
