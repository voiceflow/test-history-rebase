import React from 'react';

import { ItemProps } from '../types';
import Item from './StepItem';

const SUCCESS_COLOR = '#38751f';

export type SuccessStepItemV2Props = Omit<ItemProps, 'icon' | 'portColor' | 'iconColor'>;

const SuccessStepItemV2: React.FC<SuccessStepItemV2Props> = ({ label = 'Success', ...props }) => (
  <Item label={label} icon="checkSquare" iconColor={SUCCESS_COLOR} textColor={SUCCESS_COLOR} portColor={SUCCESS_COLOR} {...props} iconSize={16} />
);

export default SuccessStepItemV2;
