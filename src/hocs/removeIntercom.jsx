import React, { useEffect } from 'react';
import { IntercomAPI } from 'react-intercom';

export function RemoveIntercom(props) {
  useEffect(() => {
    IntercomAPI('update', {
      hide_default_launcher: true,
    });
    return () => {
      IntercomAPI('update', {
        hide_default_launcher: false,
      });
    };
  });
  return <>{props.children}</>;
}
const removeIntercomWrap = (WrappedComponent) => (props) => (
  <RemoveIntercom>
    <WrappedComponent {...props} />
  </RemoveIntercom>
);

export default removeIntercomWrap;
