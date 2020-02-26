import React from 'react';

import Item, { StepItemProps } from './StepItem';

const FAILURE_COLOR = '#d94c4c';

export type FailureStepItemProps = Omit<StepItemProps, 'icon' | 'portColor' | 'iconColor'>;

const FailureStepItem: React.FC<FailureStepItemProps> = ({ label = 'Failure', ...props }) => (
  <Item label={label} icon="error" iconColor={FAILURE_COLOR} portColor={FAILURE_COLOR} {...props} />
);

export default FailureStepItem;
