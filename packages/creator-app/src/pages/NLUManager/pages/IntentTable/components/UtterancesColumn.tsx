import { Box, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { NLUIntent } from '@/pages/NLUManager/types';

const UtterancesColumn: React.FC<TableTypes.ItemProps<NLUIntent>> = ({ item }) => <Box minWidth={80}>{item.inputs.length}</Box>;

export default UtterancesColumn;
