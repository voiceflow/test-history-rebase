import React from 'react';

export const MergeStatusContext = React.createContext(null);
export const { Consumer: MergeStatusConsumer } = MergeStatusContext;

// eslint-disable-next-line react/display-name
export const MergeStatusProvider = React.forwardRef(({ children }, ref) => {
  const [status, setStatus] = React.useState(null);

  React.useImperativeHandle(ref, () => ({ setStatus }), []);

  return <MergeStatusContext.Provider value={status}>{children}</MergeStatusContext.Provider>;
});
