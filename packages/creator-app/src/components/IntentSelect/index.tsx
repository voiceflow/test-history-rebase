import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import {
  Alert,
  AlertVariant,
  BaseSelectProps,
  IconButton,
  isNotUIOnlyMenuItemOption,
  isUIOnlyMenuItemOption,
  NestedMenuComponents,
  Select,
  toast,
  UIOnlyMenuItemOption,
} from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { CUSTOMIZABLE_INTENT_PREFIXS, ModalType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import { useDispatch, useFeature, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { ClassName } from '@/styles/constants';
import {
  applyPlatformIntentAndSlotNameFormatting,
  intentFilter,
  isCustomizableBuiltInIntent,
  prettifyIntentName,
  validateIntentName,
} from '@/utils/intent';

import { Option } from './components';

interface IntentSelectProps
  extends Omit<
    BaseSelectProps,
    'className' | 'options' | 'searchable' | 'optionsFilter' | 'formatInputValue' | 'isButtonDisabled' | 'renderOptionLabel'
  > {
  intent?: Realtime.Intent | null;
  options?: Array<Realtime.Intent | UIOnlyMenuItemOption>;
  onChange: (value: { intent: string | null }) => void;
  clearable?: boolean;
  creatable?: boolean;
  noBuiltIns?: boolean;
  withMissingAlert?: boolean;
}

const IntentSelect: React.FC<IntentSelectProps> = ({
  icon,
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
  const slots = useSelector(SlotV2.allSlotsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);
  const allIntents = useSelector(IntentV2.allPlatformIntentsSelector);
  const immModalsV2 = useFeature(FeatureFlag.IMM_MODALS_V2);
  const { open: openCreateIntentModal } = useModals(ModalType.INTENT_CREATE);

  const createIntent = useDispatch(Intent.createIntent);

  const [trackingEvents] = useTrackingEvents();

  const options = propOptions || allIntents;

  const filteredOptions = React.useMemo(
    () =>
      options
        .filter((option) => isUIOnlyMenuItemOption(option) || intentFilter(option, intent, { noBuiltIns }))
        .map((option) =>
          isUIOnlyMenuItemOption(option)
            ? { ...option, name: option.label }
            : { ...option, name: applyPlatformIntentAndSlotNameFormatting(prettifyIntentName(option.name), platform) }
        ),
    [intent, options, platform, noBuiltIns]
  );

  const isIntentNameTaken = (searchValue: string) => {
    const searchValueLower = searchValue.toLowerCase();

    return filteredOptions.some(({ name }) => name.toLowerCase() === searchValueLower);
  };

  const optionLookup = React.useMemo(
    () =>
      filteredOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.id] = option.name;

        return acc;
      }, {}),
    [filteredOptions]
  );

  const onSelectIntent = async (nextIntentID: string | null) => {
    if (nextIntentID) {
      const isDefaultBuiltIn =
        CUSTOMIZABLE_INTENT_PREFIXS.includes(nextIntentID.split('.')[0]) || nextIntentID === VoiceflowConstants.IntentName.NONE;

      if (isDefaultBuiltIn && !intentsMap[nextIntentID]) {
        await createIntent({ id: nextIntentID, name: nextIntentID });

        trackingEvents.trackIntentCreated({ creationType: CanvasCreationType.EDITOR });
      }
    }

    onChange({ intent: nextIntentID });
  };

  const onCreate = async (name: string) => {
    const preparedName = Utils.string.removeTrailingUnderscores(prettifyIntentName(name));
    const intentByName = filteredOptions.find(({ name }) => Utils.string.removeTrailingUnderscores(name) === preparedName);

    if (!immModalsV2.isEnabled && intentByName) {
      await onSelectIntent(intentByName.id);

      return;
    }

    const intentsOnly = options.filter(isNotUIOnlyMenuItemOption);

    const error = validateIntentName(preparedName, intentsOnly, slots);

    if (error) {
      toast.error(error);
    } else if (immModalsV2.isEnabled) {
      openCreateIntentModal({ createName: preparedName, onCreate: onSelectIntent });
    } else {
      const nextIntentID = await createIntent({ name: preparedName });

      await onSelectIntent(nextIntentID);

      trackingEvents.trackIntentCreated({ creationType: CanvasCreationType.EDITOR });
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
        creatable={creatable && (!immModalsV2.isEnabled || !props.inDropdownSearch)}
        className={ClassName.INTENT_SELECT_INPUT}
        searchable
        placeholder={placeholder}
        getOptionValue={(option) => option?.id}
        getOptionLabel={(value) => (value ? optionLookup[value] : undefined)}
        formatInputValue={(value) => applyPlatformIntentAndSlotNameFormatting(value, platform)}
        isButtonDisabled={({ value }) => isIntentNameTaken(value)}
        renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
          <Option option={option} isFocused={isFocused} searchLabel={searchLabel} getOptionLabel={getOptionLabel} getOptionValue={getOptionValue} />
        )}
        renderSearchSuffix={
          immModalsV2.isEnabled
            ? ({ searchLabel }) => <IconButton size={16} icon="plus" variant={IconButton.Variant.BASIC} onClick={() => onCreate(searchLabel)} />
            : null
        }
        createInputPlaceholder={createInputPlaceholder}
        renderFooterAction={
          immModalsV2.isEnabled
            ? ({ searchLabel }) => (
                <NestedMenuComponents.FooterActionContainer onClick={() => onCreate(searchLabel)}>
                  Create New Intent
                </NestedMenuComponents.FooterActionContainer>
              )
            : null
        }
      />

      {intentMissing && (
        <Alert variant={AlertVariant.WARNING} mt={10}>
          Intent is broken or has been deleted.
        </Alert>
      )}
    </>
  );
};

export default Object.assign(IntentSelect, {
  Option,
});
