import React from 'react';

import HorizontalDivider from './components/HorizontalDivider';
import LabeledHorizontalDivider from './components/LabeledHorizontalDivider';

const Divider = ({ children, ...props }, ref) =>
  children ? (
    <LabeledHorizontalDivider {...props} ref={ref}>
      {children}
    </LabeledHorizontalDivider>
  ) : (
    <HorizontalDivider {...props} ref={ref} />
  );

export default React.forwardRef(Divider);
