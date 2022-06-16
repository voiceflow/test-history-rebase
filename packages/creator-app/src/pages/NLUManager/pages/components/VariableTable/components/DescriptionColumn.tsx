import { TableTypes } from '@voiceflow/ui';
import React from 'react';

import { OrderedVariable } from '@/hooks';
import { getVariableDescription } from '@/utils/variable';

import EmptyDash from '../../../../components/EmptyDash';

const DescriptionColumn: React.FC<TableTypes.ItemProps<OrderedVariable>> = ({ item }) => <>{getVariableDescription(item.name) || <EmptyDash />}</>;

export default DescriptionColumn;
