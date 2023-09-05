import { setDisplayName, wrapDisplayName } from 'recompose';

export const hocComponentFactory = (
  Component: React.ComponentType<any>,
  hocName: string
): (<T extends React.ComponentType<any>>(component: T) => T) => setDisplayName(wrapDisplayName(Component, hocName));
