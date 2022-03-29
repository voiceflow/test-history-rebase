import { Box, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { VARIABLE_DESCRIPTION } from '@/components/Canvas/constants';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { useOrderedVariables } from '@/pages/Canvas/components/NLUQuickView/hooks';
import THEME from '@/styles/theme';

const VariablesSection: React.FC = () => {
  const { selectedID } = React.useContext(NLUQuickViewContext);
  const { mergedVariablesMap } = useOrderedVariables();
  const selectedBuiltInName = mergedVariablesMap[selectedID]?.name;
  return (
    <Box p={32} fontSize={13} color={THEME.colors[ThemeColor.SECONDARY]}>
      {VARIABLE_DESCRIPTION[selectedBuiltInName]}
    </Box>
  );
};

export default VariablesSection;
