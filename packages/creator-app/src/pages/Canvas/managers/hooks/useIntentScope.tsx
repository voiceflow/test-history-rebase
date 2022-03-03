import { BaseNode } from '@voiceflow/base-types';
import { OptionsMenuOption } from '@voiceflow/ui';
import React from 'react';

import MenuCheckboxOption from '@/pages/Canvas/managers/components/MenuCheckboxOption';

const useIntentScope = <T extends { intentScope?: BaseNode.Utils.IntentScope }>({
  data: { intentScope = BaseNode.Utils.IntentScope.GLOBAL },
  onChange,
}: {
  data: T;
  onChange: (changes: { intentScope: BaseNode.Utils.IntentScope }) => void;
}): OptionsMenuOption => {
  return {
    label: 'Intent Scoping',
    options: [
      {
        label: (
          <MenuCheckboxOption
            checked={intentScope === BaseNode.Utils.IntentScope.GLOBAL}
            onChange={() => onChange({ intentScope: BaseNode.Utils.IntentScope.GLOBAL })}
          >
            Listen for all intents
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
      {
        label: (
          <MenuCheckboxOption
            checked={intentScope === BaseNode.Utils.IntentScope.NODE}
            onChange={() => onChange({ intentScope: BaseNode.Utils.IntentScope.NODE })}
          >
            Only intents in this step
          </MenuCheckboxOption>
        ),
        disabled: true,
      },
    ],
  };
};

export default useIntentScope;
