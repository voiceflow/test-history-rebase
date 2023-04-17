import { Box, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { useOrderedVariables } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import THEME from '@/styles/theme';
import { getVariableDescription } from '@/utils/variable';

const VariablesSection: React.FC = () => {
  const { selectedID } = React.useContext(NLUQuickViewContext);
  const [, variablesMap] = useOrderedVariables();

  const selectedBuiltInName = variablesMap[selectedID]?.name;

  return (
    <Box p="24px 32px" fontSize={13} color={THEME.colors[ThemeColor.SECONDARY]}>
      {getVariableDescription(selectedBuiltInName)}
    </Box>
  );
};

export default VariablesSection;
