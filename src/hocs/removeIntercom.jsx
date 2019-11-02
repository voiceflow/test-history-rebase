import React, { useEffect } from 'react';
import { IntercomAPI } from 'react-intercom';

import { INTERCOM_ENABLED } from '@/config';

export function RemoveIntercom(props) {
  useEffect(() => {
    if (INTERCOM_ENABLED) {
      IntercomAPI('update', { hide_default_launcher: true });

      return () => IntercomAPI('update', { hide_default_launcher: false });
    }
  });
  return <>{props.children}</>;
}
const removeIntercomWrap = (WrappedComponent) => (props) => (
  <RemoveIntercom>
    <WrappedComponent {...props} />
  </RemoveIntercom>
);

export default removeIntercomWrap;
