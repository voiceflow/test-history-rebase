import { Nullable } from '@voiceflow/common';
import { Box, IconButton } from '@voiceflow/ui';
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
        <Box display="flex" mr={22}>
          <IconButton
            ref={ref as React.RefObject<HTMLButtonElement>}
            size={16}
            icon="sandwichMenu"
            onClick={isOpen ? onHideMenu : onOpenMenu}
            variant={IconButton.Variant.BASIC}
            disabled={isEmpty}
            activeClick={isOpen}
          />
        </Box>
      )}
    />
  );
};

export default IntentSelectDropdown;
