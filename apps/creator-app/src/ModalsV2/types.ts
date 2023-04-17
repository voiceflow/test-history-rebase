import { EmptyObject } from '@voiceflow/common';

export interface RegisteredModal<Props> extends React.FC<Props> {
  __vfModalType: string;
}

interface SharedAPI {
  id: string;
  type: string;
  hidden: boolean;
  opened: boolean;
  rendered: boolean;
  animated: boolean;
  closePrevented: boolean;
}

interface BaseInternalAPI {
  close: VoidFunction;
  remove: VoidFunction;
  enableClose: VoidFunction;
  preventClose: VoidFunction;
}

export interface VoidInternalAPI extends BaseInternalAPI {
  reject: (error: Error) => void;
  resolve: VoidFunction;
}

export interface ResultInternalAPI<Result> extends BaseInternalAPI {
  reject: (error: Error) => void;
  resolve: (result: Result) => void;
}

interface InternalProps<API extends BaseInternalAPI> extends SharedAPI {
  api: API;
}

export type VoidInternalProps = InternalProps<VoidInternalAPI>;
export type ResultInternalProps<Result> = InternalProps<ResultInternalAPI<Result>>;

interface BasePublicAPI extends SharedAPI {
  close: () => Promise<void>;
  remove: VoidFunction;
  enableClose: VoidFunction;
  preventClose: VoidFunction;
}

export interface OpenOptions {
  // unmounts and mounts model, useful when we wanna reset modal state and re-open it
  reopen?: boolean;
}

export interface VoidPublicAPI extends BasePublicAPI {
  // returns promise that resolves when modal is closed with some data, ex intent is cerated, can be rejected by .close()
  open: (options?: OpenOptions) => Promise<void>;
  // similar to open, but promise always resolved
  openVoid: (options?: OpenOptions) => Promise<void>;
  updateProps?: never;
}

export interface PropsPublicAPI<Props extends EmptyObject> extends BasePublicAPI {
  // returns promise that resolves when modal is closed with some data, ex intent is cerated, can be rejected by .close()
  open: (props: Props, options?: OpenOptions) => Promise<void>;
  // similar to open, but promise always resolved
  openVoid: (props: Props, options?: OpenOptions) => Promise<void>;
  updateProps: (props: Partial<Props>) => void;
}

export interface ResultPublicAPI<Props extends void, Result> extends BasePublicAPI {
  // returns promise that resolves when modal is closed with some data, ex intent is cerated, can be rejected by .close()
  open: (props?: Props, options?: OpenOptions) => Promise<Result>;
  // similar to open, but promise always resolved with Result or null if closed
  openVoid: (props?: Props, options?: OpenOptions) => Promise<Result | null>;
  updateProps?: never;
}

export interface PropsResultPublicAPI<Props extends EmptyObject, Result> extends BasePublicAPI {
  // returns promise that resolves when modal is closed with some data, ex intent is cerated, can be rejected by .close()
  open: (props: Props, options?: OpenOptions) => Promise<Result>;
  // similar to open, but promise always resolved with Result or null if closed
  openVoid: (props: Props, options?: OpenOptions) => Promise<Result | null>;
  updateProps: (props: Partial<Props>) => void;
}
