import React from 'react';

import * as Intercom from '@/vendors/intercom';

export function RemoveIntercom(props) {
  React.useEffect(() => {
    Intercom.updateSettings({ hide_default_launcher: true });

    return () => Intercom.updateSettings({ hide_default_launcher: false });
  }, []);

  return <>{props.children}</>;
}
const removeIntercomWrap = (WrappedComponent) => (props) => (
  <RemoveIntercom>
    <WrappedComponent {...props} />
  </RemoveIntercom>
);

export default removeIntercomWrap;
