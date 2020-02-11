import React from 'react';

import Item from './StepItem';

const SUCCESS_COLOR = '#279745';

const SuccessStepItem = ({ label = 'Success', ...props }) => (
  <Item label={label} icon="checkmark" iconColor={SUCCESS_COLOR} portColor={SUCCESS_COLOR} {...props} />
);

export default SuccessStepItem;
