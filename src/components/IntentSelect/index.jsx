import _shuffle from 'lodash/shuffle';
import _toLower from 'lodash/toLower';
import React from 'react';

import Select from '@/components/Select';
import { toast } from '@/components/Toast';
import { CUSTOMIZABLE_INTENT_PREFIXS, SPACE_REGEXP } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as Project from '@/ducks/project';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import { ClassName } from '@/styles/constants';
import {
  filterIntents,
  formatIntentName,
  isCustomizeableBuiltInIntent,
  prettifyIntentName,
  prettifyIntentNames,
  validateIntentName,
} from '@/utils/intent';
import { removeTrailingUnderscores } from '@/utils/string';
import { isAlexaPlatform } from '@/utils/typeGuards';

import { MissingIntentMessage, Option } from './components';

const getOptionValue = (option) => option.id;

const labelRenderer = ({ option, searchLabel, getOptionLabel, getOptionValue, options, platform }) => (
  <Option
    platform={platform}
    option={option}
    searchLabel={searchLabel}
    getOptionLabel={getOptionLabel}
    getOptionValue={getOptionValue}
    options={options}
  />
);

const optionsFilter = (options, searchLabel, { maxSize = options.length, getOptionLabel, getOptionValue } = {}, platform) => {
  const isAlexa = isAlexaPlatform(platform);

  const [matchedOptions, notMatchedOptions] = options.reduce(
    ([matched, notMatched], option) => {
      const lowerCasedOption = _toLower(getOptionLabel(getOptionValue(option)));
      const matcher = isAlexa ? lowerCasedOption.replace(SPACE_REGEXP, '_') : lowerCasedOption;

      if (!searchLabel || matcher.includes(_toLower(searchLabel))) {
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

function IntentSelect({ slots, platform, intent, intents, onChange, intentsMap, newIntent }) {
  const intentID = intent?.id;
  const isAlexa = isAlexaPlatform(platform);
  const filteredIntents = React.useMemo(() => prettifyIntentNames(filterIntents(intents, intent)), [intents, intent]);
  const intentLookup = React.useMemo(
    () =>
      filteredIntents.reduce((acc, intent) => {
        acc[intent.id] = intent.name;

        return acc;
      }, {}),
    [filteredIntents]
  );
  const intentMissing = intent?.id && !intentLookup[intent?.id] && !isCustomizeableBuiltInIntent(intent);

  const getOptionLabel = React.useCallback((value) => intentLookup[value], [intentLookup]);
  const isButtonDisabled = React.useCallback(
    (newName) => filteredIntents.find(({ name }) => _toLower(name).replace(SPACE_REGEXP, '_') === _toLower(newName)),
    [filteredIntents]
  );

  const onSelectIntent = React.useCallback(
    (value) => {
      const intentID = value;
      const isDefaultBuiltIn = CUSTOMIZABLE_INTENT_PREFIXS.includes(value?.split('.')[0]);
      if (isDefaultBuiltIn && !intentsMap[intentID]) {
        newIntent({ id: intentID, name: value, builtIn: true });
      }
      onChange({ intent: intentID });
    },
    [onChange]
  );

  const onCreate = React.useCallback(
    (name) => {
      const preparedName = removeTrailingUnderscores(prettifyIntentName(name));
      const intent = filteredIntents.find(({ name }) => removeTrailingUnderscores(name) === preparedName);

      if (intent) {
        return onSelectIntent(intent.id);
      }

      const error = validateIntentName(preparedName, intents, slots);

      if (error) {
        toast.error(error);
      } else {
        onSelectIntent(newIntent({ name: preparedName }));
      }
    },
    [newIntent, intentLookup, onSelectIntent]
  );

  React.useEffect(() => {
    if (intent?.id && !intentsMap[intent.id]) {
      onChange({ intent: null });
    }
  }, [intentsMap]);

  return (
    <>
      <Select
        className={ClassName.INTENT_SELECT_INPUT}
        value={intentID}
        clearable={intentID}
        options={filteredIntents}
        onCreate={onCreate}
        onSelect={onSelectIntent}
        creatable
        searchable
        placeholder="Name new intent or select existing intent"
        optionsFilter={(...args) => optionsFilter(...args, platform)}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        formatInputValue={isAlexa ? formatIntentName : undefined}
        isButtonDisabled={isButtonDisabled}
        renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, options) =>
          labelRenderer({
            option,
            searchLabel,
            getOptionLabel,
            getOptionValue,
            options,
            platform,
          })
        }
        createInputPlaceholder="Name new intent"
      />
      {intentMissing && <MissingIntentMessage variant="warning" message="Intent is broken or has been deleted." />}
    </>
  );
}

const mapStateToProps = {
  platform: Project.activePlatformSelector,
  slots: Slot.allSlotsSelector,
  intents: Intent.allPlatformIntentsSelector,
  intentsMap: Intent.mapCustomIntentsSelector,
};

const mapDispatchToProps = {
  newIntent: Intent.newIntent,
};

const mergeProps = ({ intents }, _, { intents: intentOverrides }) => ({
  intents: intentOverrides || intents,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(IntentSelect);
