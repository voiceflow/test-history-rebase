import { TableTypes } from '@voiceflow/ui';
import React from 'react';

import { OrderedVariable } from '@/hooks';

const TypeColumn: React.FC<TableTypes.ItemProps<OrderedVariable>> = ({ item }) => <>{item.type}</>;

export default TypeColumn;
