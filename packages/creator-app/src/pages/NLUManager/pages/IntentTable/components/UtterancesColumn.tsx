import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, TableTypes } from '@voiceflow/ui';
import React from 'react';

const UtterancesColumn: React.FC<TableTypes.ItemProps<Realtime.Intent>> = ({ item }) => <Box minWidth={80}>{item.inputs.length}</Box>;

export default UtterancesColumn;
