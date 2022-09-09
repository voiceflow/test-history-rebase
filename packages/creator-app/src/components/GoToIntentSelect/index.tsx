import { BaseModels } from '@voiceflow/base-types';
import { Link, Menu } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Domain from '@/ducks/domain';
import { useSelector } from '@/hooks';

import { GroupedSelect, MultilevelSelect } from './components';
import { Props } from './types';
import { createCombinedID } from './utils';

const GoToIntentSelect: React.FC<Props> = ({ value, placeholder = 'Behave as user triggered intent', ...props }) => {
  const allDomains = useSelector(Domain.allDomainsSelector);
  const activeDiagram = useSelector(DiagramV2.active.diagramSelector);
  const globalIntentStepMap = useSelector(DiagramV2.globalIntentStepMapSelector);
  const intentNodeDataLookup = useSelector(CreatorV2.intentNodeDataLookupSelector);

  const isComponentActive = !activeDiagram?.type || activeDiagram.type === BaseModels.Diagram.DiagramType.COMPONENT;

  const stepID = globalIntentStepMap[value?.diagramID ?? '']?.[value?.intentID ?? '']?.[0] ?? null;
  const topicValue = value?.diagramID && stepID ? createCombinedID(value.diagramID, value.intentID) : null;
  const componentValue = isComponentActive && value && !!intentNodeDataLookup[value.intentID] ? createCombinedID('', value.intentID) : null;
  const selectValue = isComponentActive && !topicValue ? componentValue : topicValue;

  const sharedProps = {
    value: selectValue,
    clearable: !!value,
    fullWidth: true,
    searchable: true,
    placeholder,
    inDropdownSearch: true,
    alwaysShowCreate: true,
    clearOnSelectActive: true,
    createInputPlaceholder: 'intents',
    renderEmpty: ({ close, search }: { close: VoidFunction; search: string }) => (
      <Menu.NotFound>
        {!search ? 'No open intents exists in your project. ' : 'No open intents found. '}
        <Link href={Documentation.OPEN_INTENT} onClick={close}>
          Learn more
        </Link>
      </Menu.NotFound>
    ),
  };

  return allDomains.length < 2 ? <GroupedSelect {...sharedProps} {...props} /> : <MultilevelSelect {...sharedProps} {...props} />;
};

export default GoToIntentSelect;
