import { Utils } from '@voiceflow/common';
import { Intent } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import { Alert, BaseSelectProps, isUIOnlyMenuItemOption, Menu, Select, System, toast, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';
import { useAllPlatformIntentsSelector, useCustomIntentMapSelector, useIntentNameProcessor, useOnOpenIntentCreateModal } from '@/hooks/intent.hook';
import { ClassName } from '@/styles/constants';
import { applyPlatformIntentNameFormatting, intentFilter, isCustomizableBuiltInIntent } from '@/utils/intent';

import { Option } from './components';

interface IntentSelectProps
  extends Omit<
    BaseSelectProps,
    'className' | 'options' | 'searchable' | 'optionsFilter' | 'formatInputValue' | 'isButtonDisabled' | 'renderOptionLabel'
  > {
  intent?: Platform.Base.Models.Intent.Model | Intent | null;
  options?: Array<Platform.Base.Models.Intent.Model | UIOnlyMenuItemOption | Intent>;
  onChange: (value: { intent: string | null }) => void;
  clearable?: boolean;
  creatable?: boolean;
  noBuiltIns?: boolean;
  withMissingAlert?: boolean;
}

const IntentSelect: React.FC<IntentSelectProps> = ({
  intent,
  options: propOptions,
  onChange,
  clearable,
  creatable = true,
  noBuiltIns,
  placeholder = 'Name new intent or select existing intent',
  withMissingAlert = true,
  createInputPlaceholder = 'intents',
  ...props
}) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const intentsMap = useCustomIntentMapSelector();
  const allIntents = useAllPlatformIntentsSelector();

  const intentNameProcessor = useIntentNameProcessor();
  const onOpenIntentCreateModal = useOnOpenIntentCreateModal();

  const options = propOptions || allIntents;

  const filteredOptions = React.useMemo(
    () =>
      options
        .filter((option) => isUIOnlyMenuItemOption(option) || intentFilter(option, intent, { noBuiltIns }))
        .map((option) => (isUIOnlyMenuItemOption(option) ? { ...option, name: option.label } : { ...option, name: option.name })),
    [intent, options, platform, noBuiltIns]
  );

  const isIntentNameTaken = (searchValue: string) => {
    const searchValueLower = searchValue.toLowerCase();

    return filteredOptions.some(({ name }) => name.toLowerCase() === searchValueLower);
  };

  const optionLookup = React.useMemo(() => Object.fromEntries(filteredOptions.map((option) => [option.id, option.name])), [filteredOptions]);

  const onSelectIntent = async (nextIntentID: string | null) => {
    onChange({ intent: nextIntentID });
  };

  const onCreateFromButton = async (name: string) => {
    const nameIsUnchanged = name === intent?.name;

    onCreate(nameIsUnchanged ? '' : name);
  };

  const onCreate = async (name: string) => {
    const { error, formattedName } = intentNameProcessor(name);

    if (error) {
      toast.error(error);
      return;
    }

    try {
      const intent = await onOpenIntentCreateModal({ name: formattedName, folderID: null });

      onSelectIntent(intent.id);
    } catch {
      // closed
    }
  };

  React.useEffect(() => {
    if (intent?.id && !intentsMap[intent.id]) {
      onChange({ intent: null });
    }
  }, [intentsMap]);

  const intentID = intent?.id;
  const intentMissing = withMissingAlert && intentID && !optionLookup[intentID] && !isCustomizableBuiltInIntent(intent);

  return (
    <>
      <Select
        {...props}
        value={intentID}
        options={filteredOptions}
        onCreate={onCreate}
        onSelect={onSelectIntent}
        clearable={!!clearable && !!intentID}
        creatable={creatable && !props.inDropdownSearch}
        className={ClassName.INTENT_SELECT_INPUT}
        searchable
        placeholder={placeholder}
        getOptionValue={(option) => option?.id}
        getOptionLabel={(value) => (value ? optionLookup[value] : undefined)}
        formatInputValue={(value) => applyPlatformIntentNameFormatting(value, platform)}
        isButtonDisabled={({ value }) => isIntentNameTaken(value)}
        createInputPlaceholder={createInputPlaceholder}
        renderEmpty={({ search }) => <Menu.NotFound>{!search ? 'No intents exist in your assistant. ' : 'No intents found. '}</Menu.NotFound>}
        renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
          <Option option={option} isFocused={isFocused} searchLabel={searchLabel} getOptionLabel={getOptionLabel} getOptionValue={getOptionValue} />
        )}
        renderSearchSuffix={({ close, searchLabel }) => (
          <System.IconButtonsGroup.Base>
            <System.IconButton.Base icon="plus" onClick={Utils.functional.chain(close, () => onCreate(searchLabel))} />
          </System.IconButtonsGroup.Base>
        )}
        renderFooterAction={({ close, searchLabel }) => (
          <Menu.Footer>
            <Menu.Footer.Action onClick={Utils.functional.chain(close, () => onCreateFromButton(searchLabel))}>Create New Intent</Menu.Footer.Action>
          </Menu.Footer>
        )}
      />

      {intentMissing && (
        <Alert variant={Alert.Variant.WARNING} mt={10} mb={16}>
          Intent is broken or has been deleted.
        </Alert>
      )}
    </>
  );
};

export default Object.assign(IntentSelect, {
  Option,
});
