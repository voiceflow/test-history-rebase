import { EmptyObject } from '@voiceflow/common';

export interface RegisteredModal<Props, ModalProps = never, ModalResult = never> extends React.FC<Props> {
  __vfModalType: string;
  __vfModalProps: ModalProps;
  __vfModalResult: ModalResult;
}

export type CloseSource = 'esc' | 'api' | 'hook' | 'backdrop';

interface SharedAPI {
  id: string;
  type: string;
  hidden: boolean;
  opened: boolean;
  animated: boolean;
  closePrevented: boolean;
}

interface BaseInternalAPI<Props> {
  __props?: Props;

  close: (source?: CloseSource) => void;
  remove: VoidFunction;
  enableClose: VoidFunction;
  updateProps: Props extends void ? never : (props: Props, options?: { reopen?: boolean }) => void;
  preventClose: VoidFunction;

  onClose: VoidFunction;
  onEscClose: VoidFunction;

  useOnCloseRequest: (callback: (source: CloseSource) => boolean) => void;
}

export interface VoidInternalAPI<Props> extends BaseInternalAPI<Props> {
  reject: (error: Error) => void;
  resolve: VoidFunction;
}

export interface ResultInternalAPI<Props, Result> extends BaseInternalAPI<Props> {
  reject: (error: Error) => void;
  resolve: (result: Result) => void;
}

export interface InternalProps<API extends BaseInternalAPI<any>> extends SharedAPI {
  api: API;
}

export type VoidInternalProps<Props = void> = Props extends void
  ? InternalProps<VoidInternalAPI<Props>>
  : Props & InternalProps<VoidInternalAPI<Props>>;

export type ResultInternalProps<Result, Props = void> = Props extends void
  ? InternalProps<ResultInternalAPI<Props, Result>>
  : Props & InternalProps<ResultInternalAPI<Props, Result>>;

interface BasePublicAPI extends SharedAPI {
  close: () => Promise<void>;
  remove: VoidFunction;
  rendered: boolean;
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
  updateProps: (props: Props, options?: { reopen?: boolean }) => void;
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
  updateProps: (props: Props, options?: { reopen?: boolean }) => void;
}

export type AnyModal<P = any, R = any> =
  | RegisteredModal<VoidInternalProps>
  | RegisteredModal<VoidInternalProps<P>, P>
  | RegisteredModal<ResultInternalProps<R, P>, P, R>;
