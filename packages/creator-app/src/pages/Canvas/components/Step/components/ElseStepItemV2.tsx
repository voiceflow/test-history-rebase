import React from 'react';

import { ItemProps } from '../types';
import Item from './StepItem';

export type ElseStepV2ItemProps = Omit<ItemProps, 'icon' | 'portColor' | 'iconColor' | 'labelVariant'>;

const ElseStepItemV2: React.FC<ElseStepV2ItemProps> = ({ label = 'Else', palette, ...props }) => (
  <Item label={label} palette={palette} portColor="#8da2b5" textColor="#132144" {...props} />
);

export default ElseStepItemV2;
