import { Normalized } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { SlatePluginsOptions, SlatePluginType, SlateVariableItem } from '@/components/SlateEditable';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useVariableCreateModal } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/redux';

interface SlateVariablesOptions {
  variables?: Normalized<SlateVariableItem>;
  creatable?: boolean;
  withSlots?: boolean;
}

export const useSlateVariables = ({
  creatable,
  withSlots,
  variables: propVariables,
}: SlateVariablesOptions): SlatePluginsOptions[SlatePluginType.VARIABLES] | undefined => {
  const variableCreateModal = useVariableCreateModal();

  const variables = useSelector((state) => propVariables ?? DiagramV2.active.allSlotsAndVariablesNormalizedSelector(state));

  const onCreate = React.useCallback(
    async (name: string) => {
      try {
        return variableCreateModal.open({ name, folderID: null });
      } catch {
        return null;
      }
    },
    [variableCreateModal.open]
  );

  return useContextApi<NonNullable<SlatePluginsOptions[SlatePluginType.VARIABLES]>>({
    onCreate,
    variables,
    creatable,
    withSlots,
  });
};
