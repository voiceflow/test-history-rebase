import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';

import { ItemProps } from '../types';
import Item from './StepItem';
import Section from './StepSection';

export type ElseStepItemProps = Omit<ItemProps, 'icon' | 'portColor' | 'iconColor' | 'labelVariant'>;

const ElseStepItem: React.FC<ElseStepItemProps> = ({ label = 'Else', ...props }) => (
  <Section>
    <Item icon="else" label={label} iconColor="#6e849a" labelVariant={StepLabelVariant.SECONDARY} portColor="#8da2b5" {...props} />
  </Section>
);

export default ElseStepItem;
