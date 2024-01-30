import { Normalized } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast, useContextApi } from '@voiceflow/ui';
import React from 'react';

import { SlatePluginsOptions, SlatePluginType, SlateVariableItem } from '@/components/SlateEditable';
import * as DiagramV2 from '@/ducks/diagramV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/versionV2';
import { useFeature } from '@/hooks/feature';
import { useVariableCreateModal } from '@/hooks/modal.hook';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { getErrorMessage } from '@/utils/error';

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
  const cmsVariables = useFeature(Realtime.FeatureFlag.CMS_VARIABLES);
  const variableCreateModal = useVariableCreateModal();

  const variables = useSelector((state) => propVariables ?? DiagramV2.active.allSlotsAndVariablesNormalizedSelector(state));
  const addGlobalVariable = useDispatch(Version.addGlobalVariable);

  const onCreate = React.useCallback(
    async (name: string) => {
      if (cmsVariables.isEnabled) {
        try {
          return variableCreateModal.open({ name, folderID: null });
        } catch {
          return null;
        }
      }

      try {
        await addGlobalVariable(name, CanvasCreationType.EDITOR);

        return { id: name, name };
      } catch (err) {
        toast.error(getErrorMessage(err));

        return null;
      }
    },
    [addGlobalVariable, variableCreateModal.open]
  );

  return useContextApi<NonNullable<SlatePluginsOptions[SlatePluginType.VARIABLES]>>({ onCreate, variables, creatable, withSlots });
};
