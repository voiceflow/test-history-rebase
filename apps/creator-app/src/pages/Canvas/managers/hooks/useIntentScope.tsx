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
}): OptionsMenuOption => ({
  label: 'Intent scoping',
  options: [
    {
      label: <MenuCheckboxOption checked={intentScope === BaseNode.Utils.IntentScope.GLOBAL}>Listen for all intents</MenuCheckboxOption>,
      onClick: () => onChange({ intentScope: BaseNode.Utils.IntentScope.GLOBAL }),
    },
    {
      label: <MenuCheckboxOption checked={intentScope === BaseNode.Utils.IntentScope.NODE}>Only intents in this step</MenuCheckboxOption>,
      onClick: () => onChange({ intentScope: BaseNode.Utils.IntentScope.NODE }),
    },
  ],
});

export default useIntentScope;
