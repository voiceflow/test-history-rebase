import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';

import { ItemProps } from '../types';
import Item from './StepItem';
import Section from './StepSection';

export type NoMatchStepItemProps = Omit<ItemProps, 'icon' | 'portColor' | 'iconColor' | 'labelVariant'>;

const NoMatchStepItem: React.FC<NoMatchStepItemProps> = ({ label = 'No Match', ...props }) => (
  <Section>
    <Item label={label} iconColor="#6e849a" labelVariant={StepLabelVariant.SECONDARY} portColor="#8da2b5" {...props} />
  </Section>
);

export default NoMatchStepItem;
