import React from 'react';

import HorizontalDivider from './components/HorizontalDivider';
import LabeledHorizontalDivider from './components/LabeledHorizontalDivider';

function Divider({ children, ...props }, ref) {
  return children ? (
    <LabeledHorizontalDivider {...props} ref={ref}>
      {children}
    </LabeledHorizontalDivider>
  ) : (
    <HorizontalDivider {...props} ref={ref} />
  );
}

export default React.forwardRef(Divider);
