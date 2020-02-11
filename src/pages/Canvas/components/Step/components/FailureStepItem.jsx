import React from 'react';

import Item from './StepItem';

const FAILURE_COLOR = '#d94c4c';

const FailureStepItem = ({ label = 'Failure', ...props }) => (
  <Item label={label} icon="error" iconColor={FAILURE_COLOR} portColor={FAILURE_COLOR} {...props} />
);

export default FailureStepItem;
