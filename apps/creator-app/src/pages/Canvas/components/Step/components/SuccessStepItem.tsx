import React from 'react';

import { ItemProps } from '../types';
import Item from './StepItem';

const SUCCESS_COLOR = '#279745';

export type SuccessStepItemProps = Omit<ItemProps, 'icon' | 'portColor' | 'iconColor'>;

const SuccessStepItem: React.FC<SuccessStepItemProps> = ({ label = 'Success', ...props }) => (
  <Item label={label} icon="checkmark" iconColor={SUCCESS_COLOR} portColor={SUCCESS_COLOR} {...props} />
);

export default SuccessStepItem;
