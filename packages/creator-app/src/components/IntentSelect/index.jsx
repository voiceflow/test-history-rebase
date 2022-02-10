import { Utils } from '@voiceflow/common';
import { Alert, AlertVariant, Select, toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _shuffle from 'lodash/shuffle';
import _toLower from 'lodash/toLower';
import React from 'react';

import { CUSTOMIZABLE_INTENT_PREFIXS, SPACE_REGEXP } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import { connect } from '@/hocs';
import { useTrackingEvents } from '@/hooks';
import { ClassName } from '@/styles/constants';
import {
  applyPlatformIntentNameFormatting,
  filterIntents,
  isCustomizableBuiltInIntent,
  prettifyIntentName,
  prettifyIntentNames,
  validateIntentName,
} from '@/utils/intent';
import { isGeneralPlatform } from '@/utils/typeGuards';

import { Option } from './components';

const getOptionValue = (option) => option?.id;

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
  const isGeneral = isGeneralPlatform(platform);

  const [matchedOptions, notMatchedOptions] = options.reduce(
    ([matched, notMatched], option) => {
      const lowerCasedOption = _toLower(getOptionLabel(getOptionValue(option)));
      const matcher = isGeneral ? lowerCasedOption : lowerCasedOption.replace(SPACE_REGEXP, '_');

      if (!searchLabel || matcher.includes(_toLower(searchLabel))) {
        matched.push(option);
      } else if (!option?.menuItemProps?.divider) {
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

function IntentSelect({
  icon = undefined,
  slots,
  intent,
  intents,
  onChange,
  inDropdownSearch = false,
  platform,
  createIntent,
  clearable = false,
  creatable = true,
  iconProps = undefined,
  intentsMap,
  renderEmpty = undefined,
  triggerRenderer = undefined,
  alwaysShowCreate = false,
  withMissingAlert = true,
  placeholder = 'Name new intent or select existing intent',
}) {
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
  const intentMissing = withMissingAlert && intent?.id && !intentLookup[intent?.id] && !isCustomizableBuiltInIntent(intent);
  const [trackingEvents] = useTrackingEvents();

  const getOptionLabel = React.useCallback((value) => intentLookup[value], [intentLookup]);
  const isButtonDisabled = React.useCallback(
    (newName) => filteredIntents.find(({ name }) => _toLower(name).replace(SPACE_REGEXP, '_') === _toLower(newName)),
    [filteredIntents]
  );

  const onSelectIntent = React.useCallback(
    async (nextIntentID) => {
      const isDefaultBuiltIn =
        CUSTOMIZABLE_INTENT_PREFIXS.includes(nextIntentID?.split('.')[0]) || nextIntentID === VoiceflowConstants.IntentName.NONE;

      if (isDefaultBuiltIn && !intentsMap[nextIntentID]) {
        await createIntent({ id: nextIntentID, name: nextIntentID, builtIn: true });
        trackingEvents.trackIntentCreated({ creationType: CanvasCreationType.EDITOR });
      }

      onChange({ intent: nextIntentID });
    },
    [onChange]
  );

  const onCreate = React.useCallback(
    async (name) => {
      const preparedName = Utils.string.removeTrailingUnderscores(prettifyIntentName(name));
      const intentByName = filteredIntents.find(({ name }) => Utils.string.removeTrailingUnderscores(name) === preparedName);

      if (intentByName) {
        return onSelectIntent(intentByName.id);
      }

      const error = validateIntentName(preparedName, intents, slots);

      if (error) {
        toast.error(error);
      } else {
        const nextIntentID = await createIntent({ name: preparedName });
        trackingEvents.trackIntentCreated({ creationType: CanvasCreationType.EDITOR });
        await onSelectIntent(nextIntentID);
      }
    },
    [intentLookup, onSelectIntent]
  );

  React.useEffect(() => {
    if (intent?.id && !intentsMap[intent.id]) {
      onChange({ intent: null });
    }
  }, [intentsMap]);

  return (
    <>
      <Select
        icon={icon}
        triggerRenderer={triggerRenderer}
        iconProps={iconProps}
        className={ClassName.INTENT_SELECT_INPUT}
        value={intentID}
        options={filteredIntents}
        onCreate={onCreate}
        onSelect={onSelectIntent}
        clearable={clearable && !!intentID}
        creatable={creatable}
        searchable
        renderEmpty={renderEmpty}
        inDropdownSearch={inDropdownSearch}
        placeholder={placeholder}
        optionsFilter={(...args) => optionsFilter(...args, platform)}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        formatInputValue={(val) => applyPlatformIntentNameFormatting(val, platform)}
        alwaysShowCreate={alwaysShowCreate}
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
        createInputPlaceholder="intents"
      />
      {intentMissing && <Alert variant={AlertVariant.WARNING} message="Intent is broken or has been deleted." mt={10} />}
    </>
  );
}

const mapStateToProps = {
  platform: ProjectV2.active.platformSelector,
  slots: SlotV2.allSlotsSelector,
  intents: IntentV2.allPlatformIntentsSelector,
  intentsMap: IntentV2.customIntentMapSelector,
};

const mapDispatchToProps = {
  createIntent: Intent.createIntent,
};

const mergeProps = ({ intents }, _, { intents: intentOverrides }) => ({
  intents: intentOverrides || intents,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(IntentSelect);
