import { setDisplayName, wrapDisplayName } from 'recompose';

export type HOC<S extends object = {}> = <D extends object>(Component: React.ComponentType<S & D>) => React.ComponentType<S & D>;

export const createHOC =
  <S extends object = {}>(name: string) =>
  <D extends object>(createComponent: (Component: React.ComponentType<S & D>) => React.ComponentType<S & D>) =>
  (Component: React.ComponentType<S & D>): React.ComponentType<S & D> =>
    setDisplayName(wrapDisplayName(Component, name))(createComponent(Component));
