import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
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

import { Designer } from '@/ducks';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature } from '@/hooks/feature';
import { useSelector } from '@/hooks/redux';
import { useCreateIntentModal, useIntentCreateModalV2 } from '@/ModalsV2/hooks';
import { useNLUManager } from '@/pages/NLUManager/context';
import { intentFilter } from '@/utils/intent';
import { utteranceTextToString } from '@/utils/utterance.util';

import * as S from './styles';

interface AssignToIntentDropdownProps extends BaseSelectProps {
  utteranceIDs: string[];
  onClickOutside?: () => void;
}

const INTENT_SUGGESTION_THRESHOLD = 0.5;
const INTENT_SUGGESTION_MAX = 3;

const AssignToIntentDropdown: React.FC<AssignToIntentDropdownProps> = ({ utteranceIDs, onClose, onClickOutside = () => {}, renderTrigger }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const v2CMS = useFeature(Realtime.FeatureFlag.V2_CMS);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const allIntents = useSelector(IntentV2.allPlatformIntentsSelector);
  const entitiesMapByID = useSelector(Designer.Entity.selectors.map);
  const entitiesMapByName = useSelector(Designer.Entity.selectors.mapByName);
  const getAllUtterancesByIntentID = useSelector(Designer.Intent.Utterance.selectors.getAllByIntentID);
  const nluManager = useNLUManager();
  const createIntentModal = useCreateIntentModal();
  const intentCreateModalV2 = useIntentCreateModalV2();

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

  const mapIntentOptions = (intents: Platform.Base.Models.Intent.Model[]) => {
    return intents.map((option) => (isUIOnlyMenuItemOption(option) ? { ...option, name: option.label } : { ...option, name: option.name }));
  };

  const handleSelect = async (intentID: string | null) => {
    if (!intentID) return;
    await nluManager.assignUnclassifiedUtterancesToIntent(intentID, utterances);
    toast.success('Assigned to intent');
  };

  const handleNewIntentFromSelection = async () => {
    try {
      const createdUtterancesSet = new Set<string>();

      if (v2CMS.isEnabled) {
        const intent = await intentCreateModalV2.open({
          folderID: null,
          utterances: utterances.map(({ utterance }) =>
            // TODO: get rid of adapter when unclassified utterances migrated to new utterance format
            utteranceTextToString.toDB(utterance, {
              regexp: /{{\[[^ .[\]{}]*?]\.([^ .[\]{}]*?)}}/g,
              entitiesMapByID,
              entitiesMapByName,
            })
          ),
        });

        const intentUtterances = getAllUtterancesByIntentID({ intentID: intent.id });

        intentUtterances.forEach(({ text }) =>
          createdUtterancesSet.add(
            // TODO: get rid of adapter when unclassified utterances migrated to new utterance format
            utteranceTextToString.fromDB(text, {
              entityToString: ({ id, value }) => `{{[${id}].${value?.name ?? id}}}`,
              entitiesMapByID,
            })
          )
        );
      } else {
        const { inputs } = await createIntentModal.open({ utterances: utterances.map((u) => u.utterance) });

        inputs.forEach(({ text }) => createdUtterancesSet.add(text));
      }

      if (createdUtterancesSet.size) {
        nluManager.deleteUnclassifiedUtterances(utterances.filter((u) => createdUtterancesSet.has(u.utterance)));
      }

      toast.success('Intent created');
    } catch {
      // do nothing
    }
  };

  const filteredOptions = React.useMemo(() => {
    let suggestedIntents;
    const filteredIntents = allIntents.filter((option) => isUIOnlyMenuItemOption(option) || intentFilter(option, null, { noBuiltIns: true }));
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
