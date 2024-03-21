import { BaseSelectProps, Link, Menu, Select } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useDomainAndDiagramMultilevelSelectOptions, useSelector } from '@/hooks';
import { isComponentDiagram } from '@/utils/diagram.utils';

import { useDiagramsIntentsOptionsMap } from './hooks';
import { Multilevel, Value } from './types';
import { createCombinedID } from './utils';

export interface GoToIntentSelectProps extends BaseSelectProps {
  value: Value | null;
  onChange: (value: Value | null) => void;
}

const GoToIntentSelect: React.FC<GoToIntentSelectProps> = ({
  value,
  onChange,
  fullWidth = true,
  searchable = true,
  renderEmpty,
  placeholder = 'Behave as user triggered intent',
  inDropdownSearch = true,
  alwaysShowCreate = true,
  clearOnSelectActive = true,
  nestedMenuAutoWidth = false,
  createInputPlaceholder = 'intents',
  ...props
}) => {
  const activeDiagram = useSelector(DiagramV2.active.diagramSelector);
  const globalIntentStepMap = useSelector(DiagramV2.globalIntentStepMapSelector);
  const intentNodeDataLookup = useSelector(CreatorV2.intentNodeDataLookupSelector);

  const isComponentActive = !activeDiagram?.type || isComponentDiagram(activeDiagram.type);

  const diagramsIntentsOptions = useDiagramsIntentsOptionsMap();

  const { options, optionsMap } = useDomainAndDiagramMultilevelSelectOptions(diagramsIntentsOptions, { diagramGroupName: 'Intents' });

  const onSelect = (value: string | null) => {
    const option = value ? optionsMap[value] : null;

    if (!option || !('intentID' in option)) {
      onChange(null);
      return;
    }

    onChange({ intentID: option.intentID, diagramID: option.diagramID });
  };

  const stepID = globalIntentStepMap[value?.diagramID ?? '']?.[value?.intentID ?? '']?.[0] ?? null;
  const topicValue = value?.diagramID && stepID ? createCombinedID(value.diagramID, value.intentID) : null;
  const componentValue = isComponentActive && value && !!intentNodeDataLookup[value.intentID] ? createCombinedID('', value.intentID) : null;
  const selectValue = isComponentActive && !topicValue ? componentValue : topicValue;

  return (
    <Select<Multilevel, string>
      {...props}
      value={selectValue}
      options={options}
      onSelect={onSelect}
      clearable={!!value}
      fullWidth={fullWidth}
      searchable={searchable}
      placeholder={placeholder}
      isMultiLevel
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => value && optionsMap[value]?.label}
      inDropdownSearch={inDropdownSearch}
      alwaysShowCreate={alwaysShowCreate}
      clearOnSelectActive={clearOnSelectActive}
      nestedMenuAutoWidth={nestedMenuAutoWidth}
      createInputPlaceholder={createInputPlaceholder}
      renderEmpty={
        renderEmpty ??
        (({ close, search }: { close: VoidFunction; search: string }) => (
          <Menu.NotFound>
            {!search ? 'No open intents exists in your assistant. ' : 'No open intents found. '}
            <Link href={Documentation.OPEN_INTENT} onClick={close}>
              Learn more
            </Link>
          </Menu.NotFound>
        ))
      }
    />
  );
};

export default GoToIntentSelect;
