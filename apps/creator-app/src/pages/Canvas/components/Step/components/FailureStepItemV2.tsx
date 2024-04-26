import React from 'react';

import type { ItemProps } from '../types';
import Item from './StepItem';

const FAILURE_COLOR = '#c62445';

export type FailureStepItemV2Props = Omit<ItemProps, 'icon' | 'portColor' | 'iconColor'>;

const FailureStepItemV2: React.FC<FailureStepItemV2Props> = ({ label = 'Fail', ...props }) => (
  <Item
    label={label}
    icon="close"
    iconColor={FAILURE_COLOR}
    textColor={FAILURE_COLOR}
    portColor={FAILURE_COLOR}
    {...props}
    iconSize={14}
  />
);

export default FailureStepItemV2;
