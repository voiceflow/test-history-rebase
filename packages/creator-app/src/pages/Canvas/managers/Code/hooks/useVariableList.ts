import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { useSelector } from 'react-redux';

import * as DiagramV2 from '@/ducks/diagramV2';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

const useVariableList = (platform: VoiceflowConstants.PlatformType) => {
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);
  return React.useMemo(() => [...getPlatformGlobalVariables(platform), ...variables, 'voiceflow', '_system'], [platform, variables]);
};

export default useVariableList;
