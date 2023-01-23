import * as Platform from '@voiceflow/platform-config';
import { BaseSelectProps, createDividerMenuItemOption, isUIOnlyMenuItemOption, Menu, Select } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { useModals, useSelector } from '@/hooks';
import { useNLUManager } from '@/pages/NLUManager/context';
import { applyPlatformIntentNameFormatting, intentFilter, prettifyIntentName } from '@/utils/intent';

interface AssignToIntentDropdownProps extends BaseSelectProps {
  utteranceIDs: string[];
}

const AssignToIntentDropdown: React.FC<AssignToIntentDropdownProps> = ({ utteranceIDs, renderTrigger }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const allIntents = useSelector(IntentV2.allPlatformIntentsSelector);
  const nluManager = useNLUManager();
  const { open: openCreateIntentModal } = useModals(ModalType.INTENT_CREATE);

  const utterances = React.useMemo(
    () => nluManager.unclassifiedUtterances.filter((u) => utteranceIDs.includes(u.id)),
    [utteranceIDs, nluManager.unclassifiedUtterances]
  );

  const utterance = utterances[0];

  const suggestedIntentNames = React.useMemo(
    () => utterance?.utterance && nluManager.clusteringData && nluManager.clusteringData[utterance?.utterance],
    [utterance]
  );

  const isSuggestedIntent = (intentName: string) => {
    if (!suggestedIntentNames) return false;
    return Object.keys(suggestedIntentNames).includes(intentName) && suggestedIntentNames[intentName] > 0;
  };

  const getSuggestionScore = (intentName: string) => suggestedIntentNames && Math.round(suggestedIntentNames[intentName] * 100);

  const mapIntentOptions = (intents: Platform.Base.Models.Intent.Model[]) => {
    return intents.map((option) =>
      isUIOnlyMenuItemOption(option)
        ? { ...option, name: option.label }
        : { ...option, name: applyPlatformIntentNameFormatting(prettifyIntentName(option.name), platform) }
    );
  };

  const handleSelect = async (intentID: string | null) => {
    if (!intentID) return;
    await nluManager.assignUnclassifiedUtterancesToIntent(intentID, utterances);
  };

  const handleNewIntentFromSelection = () => {
    openCreateIntentModal({
      utterances: utterances.map((u) => u.utterance),
      onCreate: (_: string, intentData: Partial<Platform.Base.Models.Intent.Model>) => {
        if (!intentData.inputs) return;
        const createdUtterances = new Set(intentData.inputs.map((i) => i.text));
        nluManager.deleteUnclassifiedUtterances(utterances.filter((u) => createdUtterances.has(u.utterance)));
      },
    });
  };

  const filteredOptions = React.useMemo(() => {
    let suggestedIntents;
    const filteredIntents = allIntents.filter((option) => isUIOnlyMenuItemOption(option) || intentFilter(option, null, { noBuiltIns: true }));
    const intents = mapIntentOptions(filteredIntents.filter((option) => !isSuggestedIntent(option.name)));

    if (suggestedIntentNames) {
      suggestedIntents = mapIntentOptions(filteredIntents.filter((option) => isSuggestedIntent(option.name)));
    }

    return suggestedIntents ? [...suggestedIntents, createDividerMenuItemOption(), ...intents] : intents;
  }, [allIntents, suggestedIntentNames, platform]);

  const optionLookup = React.useMemo(() => Object.fromEntries(filteredOptions.map((option: any) => [option.id, option.name])), [filteredOptions]);

  return (
    <Select
      value={null}
      options={filteredOptions}
      creatable
      inDropdownSearch
      alwaysShowCreate
      searchable
      clearable={false}
      onSelect={handleSelect}
      minWidth={false}
      minMenuWidth={300}
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => (value ? optionLookup[value] : undefined)}
      createInputPlaceholder="intents"
      modifiers={{ offset: { enabled: true, offset: '-60px,0px' } }}
      renderOptionLabel={({ name }) => (
        <>
          {name}
          {isSuggestedIntent(name) && <Menu.ItemNote>{getSuggestionScore(name)}%</Menu.ItemNote>}
        </>
      )}
      renderFooterAction={() => (
        <Menu.Footer onClick={handleNewIntentFromSelection}>
          <Menu.Footer.Action>New Intent from selection</Menu.Footer.Action>
        </Menu.Footer>
      )}
      renderTrigger={(props) => renderTrigger && renderTrigger({ ...props })}
    />
  );
};

export default AssignToIntentDropdown;
