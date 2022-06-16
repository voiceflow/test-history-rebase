import * as Realtime from '@voiceflow/realtime-sdk';
import { TableTypes } from '@voiceflow/ui';
import React from 'react';

const TypeColumn: React.FC<TableTypes.ItemProps<Realtime.Slot>> = ({ item }) => <>{item.type}</>;

export default TypeColumn;
