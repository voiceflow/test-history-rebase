import React from 'react';

import { RemoveIntercom } from '@/components/IntercomChat';

const removeIntercom = (WrappedComponent) => (props) => (
  <RemoveIntercom>
    <WrappedComponent {...props} />
  </RemoveIntercom>
);

export default removeIntercom;
