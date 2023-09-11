export interface IPageLoaderProvider extends React.PropsWithChildren {}

export interface IPageLoaderLoaded {
  id: string;
}

export interface IPageLoaderContext {
  loaded: (id: string) => void;
  register: (id: string) => VoidFunction;
}

export interface IPageLoaderProgressContext {
  [k: string]: boolean;
}
