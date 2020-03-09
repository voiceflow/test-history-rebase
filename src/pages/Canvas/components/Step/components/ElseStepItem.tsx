import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';

import { ItemProps } from '../types';
import Item from './StepItem';
import Section from './StepSection';

export type ElseStepItemProps = Omit<ItemProps, 'icon' | 'label' | 'portColor' | 'iconColor' | 'labelVariant'>;

const ElseStepItem: React.FC<ElseStepItemProps> = (props) => (
  <Section>
    <Item icon="else" iconColor="#6e849a" label="Else" labelVariant={StepLabelVariant.SECONDARY} portColor="#8da2b5" {...props} />
  </Section>
);

export default ElseStepItem;
