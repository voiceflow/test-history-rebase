import { FlexApart, FlexStart, Select, SelectInputVariant } from '@voiceflow/ui';
import startCase from 'lodash/startCase';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import * as IntentDuck from '@/ducks/intent';
import { useSelector } from '@/hooks';

import { ExportContext } from '../contexts';

interface IntentOption {
  id: string;
  label: string;
}

const getIntentName = (intentName: string) => startCase(intentName.toLowerCase());

const customMenuLabelRenderer = (option: IntentOption, isSelectedFunc: (val: string) => boolean) => {
  return (
    <FlexApart style={{ width: '100%' }}>
      <FlexStart>
        <Checkbox readOnly checked={isSelectedFunc(option.id)} />
        <div data-testid={option.id}>{option.label}</div>
      </FlexStart>
    </FlexApart>
  );
};

const ModelIntentsSelect: React.FC = () => {
  const { setModelExportIntents: setSelectedIntents, modelExportIntents: selectedIntents } = React.useContext(ExportContext)!;
  const intents = useSelector(IntentDuck.allIntentsSelector);

  const intentMap = React.useMemo(
    () => intents.reduce((intents, intent) => ({ ...intents, [intent.id]: getIntentName(intent.name) }), {} as Record<string, string>),
    [intents]
  );

  const intentsOptions = React.useMemo(() => intents.map((intent) => ({ id: intent.id, label: getIntentName(intent.name) })), [intents]);

  const displayName = React.useMemo(() => selectedIntents.map((intentID: string) => intentMap[intentID]).join(', '), [selectedIntents]);

  const selectedAllIntents = selectedIntents.length === intentsOptions.length;

  const handleSelectIntent = (option: IntentOption) => {
    if (selectedIntents.includes(option.id)) {
      const newSelectedIntents = selectedIntents.filter((intentID) => intentID !== option.id);
      setSelectedIntents(newSelectedIntents);
    } else {
      setSelectedIntents([...selectedIntents, option.id]);
    }
  };

  const handleSelectAll = () => {
    let allOptionsValues: string[] = [];

    if (!selectedAllIntents) {
      allOptionsValues = intentsOptions.map((option) => option.id);
    }

    setSelectedIntents(allOptionsValues);
  };

  const isOptionSelected = (intentID: string) => selectedIntents.includes(intentID);

  return (
    <Select
      autoWidth
      renderOptionLabel={(option) => customMenuLabelRenderer(option, isOptionSelected)}
      footerAction
      footerActionLabel={selectedAllIntents ? 'Unselect all' : 'Select all'}
      onClickFooterAction={handleSelectAll}
      fullWidth
      selectedOptions={selectedIntents}
      options={intentsOptions}
      withSearchIcon
      inDropdownSearch
      searchable
      alwaysShowCreate
      autoDismiss={false}
      createInputPlaceholder="intents"
      getOptionLabel={(intentOption) => (intentOption ? intentMap[intentOption.id] : '')}
      placeholder="Select all that apply"
      displayName={displayName}
      onSelect={handleSelectIntent}
      inputVariant={SelectInputVariant.COUNTER}
    />
  );
};

export default ModelIntentsSelect;
