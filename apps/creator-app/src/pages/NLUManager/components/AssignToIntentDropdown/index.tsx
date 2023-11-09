import { Utils } from '@voiceflow/common';
import { Intent } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import {
  BaseSelectProps,
  createDividerMenuItemOption,
  isUIOnlyMenuItemOption,
  Menu,
  Select,
  TippyTooltip,
  toast,
  useOnClickOutside,
} from '@voiceflow/ui';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useAllPlatformIntentsSelector } from '@/hooks/intent.hook';
import { useSelector } from '@/hooks/redux';
import { useCreateIntentModal } from '@/ModalsV2/hooks/helpers';
import { useNLUManager } from '@/pages/NLUManager/context';
import { intentFilter } from '@/utils/intent';

import * as S from './styles';

interface AssignToIntentDropdownProps extends BaseSelectProps {
  utteranceIDs: string[];
  onClickOutside?: () => void;
}

const INTENT_SUGGESTION_THRESHOLD = 0.5;
const INTENT_SUGGESTION_MAX = 3;

const AssignToIntentDropdown: React.FC<AssignToIntentDropdownProps> = ({ utteranceIDs, onClose, onClickOutside = () => {}, renderTrigger }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const allIntents = useAllPlatformIntentsSelector();
  const nluManager = useNLUManager();
  const createIntentModal = useCreateIntentModal();

  useOnClickOutside(ref, onClickOutside);

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
    return Object.keys(suggestedIntentNames).includes(intentName) && suggestedIntentNames[intentName] > INTENT_SUGGESTION_THRESHOLD;
  };

  const getSuggestionScore = (intentName: string) => suggestedIntentNames && Math.round(suggestedIntentNames[intentName] * 100);

  const mapIntentOptions = (intents: Array<Platform.Base.Models.Intent.Model | Intent>) => {
    return intents.map((option) => (isUIOnlyMenuItemOption(option) ? { ...option, name: option.label } : { ...option, name: option.name }));
  };

  const handleSelect = async (intentID: string | null) => {
    if (!intentID) return;
    await nluManager.assignUnclassifiedUtterancesToIntent(intentID, utterances);
    toast.success('Assigned to intent');
  };

  const handleNewIntentFromSelection = async () => {
    try {
      const { inputs } = await createIntentModal.open({ utterances: utterances.map((u) => u.utterance) });

      if (!inputs.length) return;

      const createdUtterances = new Set(inputs.map(({ text }) => text));

      nluManager.deleteUnclassifiedUtterances(utterances.filter((u) => createdUtterances.has(u.utterance)));
      toast.success('Intent created');
    } catch {
      // do nothing
    }
  };

  const filteredOptions = React.useMemo(() => {
    let suggestedIntents;
    const filteredIntents = Utils.array
      .inferUnion(allIntents)
      .filter((option) => isUIOnlyMenuItemOption(option) || intentFilter(option, null, { noBuiltIns: true }));
    const suggestedIntentIDs = new Set(
      filteredIntents
        .filter((option) => isSuggestedIntent(option.name))
        .map((option) => option.id)
        .splice(0, INTENT_SUGGESTION_MAX)
    );

    const intents = mapIntentOptions(filteredIntents.filter((option) => !suggestedIntentIDs.has(option.id)));

    if (suggestedIntentNames) {
      suggestedIntents = mapIntentOptions(filteredIntents.filter((option) => suggestedIntentIDs.has(option.id)));
    }

    return suggestedIntents ? [...suggestedIntents, createDividerMenuItemOption(), ...intents] : intents;
  }, [allIntents, suggestedIntentNames, platform]);

  const optionLookup = React.useMemo(() => Object.fromEntries(filteredOptions.map((option: any) => [option.id, option.name])), [filteredOptions]);

  return (
    <div ref={ref}>
      <Select
        value={null}
        options={filteredOptions}
        creatable={false}
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
        renderEmpty={() => <Menu.NotFound>No intents exist.</Menu.NotFound>}
        onClose={onClose}
        renderOptionLabel={({ name }) => (
          <S.MenuItem>
            {name}
            {isSuggestedIntent(name) && (
              <TippyTooltip content="Match score">
                <Menu.ItemNote>{getSuggestionScore(name)}%</Menu.ItemNote>
              </TippyTooltip>
            )}
          </S.MenuItem>
        )}
        renderFooterAction={() => (
          <Menu.Footer onClick={handleNewIntentFromSelection}>
            <Menu.Footer.Action>New Intent from selection</Menu.Footer.Action>
          </Menu.Footer>
        )}
        renderTrigger={(props) => renderTrigger && renderTrigger({ ...props })}
      />
    </div>
  );
};

export default AssignToIntentDropdown;
