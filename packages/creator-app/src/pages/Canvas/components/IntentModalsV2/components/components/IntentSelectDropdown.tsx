import { Nullable } from '@voiceflow/common';
import { System } from '@voiceflow/ui';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';

interface IntentSelectDropdownProps {
  onChange: (intentID: string) => void;
}

const IntentSelectDropdown: React.FC<IntentSelectDropdownProps> = ({ onChange }) => {
  const switchIntent = (value: { intent: Nullable<string> }) => {
    if (!value?.intent) return;

    onChange(value.intent);
  };

  return (
    <IntentSelect
      minWidth={false}
      onChange={switchIntent}
      creatable={false}
      placement="left-start"
      noBuiltIns
      isDropdown
      modifiers={{ offset: { enabled: true, offset: '-10px,10px' } }}
      minMenuWidth={250}
      optionsMaxSize={7.5}
      alwaysShowCreate
      inDropdownSearch
      createInputPlaceholder="Intents"
      renderTrigger={({ ref, isEmpty, onOpenMenu, onHideMenu, isOpen }) => (
        <System.IconButtonsGroup.Base mr={12}>
          <System.IconButton.Base
            ref={ref as React.RefObject<HTMLButtonElement>}
            icon="sandwichMenu"
            active={isOpen}
            onClick={isOpen ? onHideMenu : onOpenMenu}
            disabled={isEmpty}
          />
        </System.IconButtonsGroup.Base>
      )}
    />
  );
};

export default IntentSelectDropdown;
