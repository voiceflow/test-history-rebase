import { Box, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { NLUIntent } from '@/pages/NLUManager/types';

import { EmptyDash } from '../../../components';

const UtterancesColumn: React.FC<TableTypes.ItemProps<NLUIntent>> = ({ item }) =>
  item.inputs.length ? <Box minWidth={80}>{item.inputs.length}</Box> : <EmptyDash />;

export default UtterancesColumn;
