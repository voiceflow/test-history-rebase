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
  enableClose: VoidFunction;
  preventClose: VoidFunction;
}

export interface VoidPublicAPI extends BasePublicAPI {
  // returns promise that resolves when modal is closed with some data, ex intent is cerated, can be rejected by .close()
  open: () => Promise<void>;
  // similar to open, but promise always resolved
  openVoid: () => Promise<void>;
  updateData?: never;
}

export interface PropsPublicAPI<Props extends EmptyObject> extends BasePublicAPI {
  // returns promise that resolves when modal is closed with some data, ex intent is cerated, can be rejected by .close()
  open: (props: Props) => Promise<void>;
  // similar to open, but promise always resolved
  openVoid: (props: Props) => Promise<void>;
  updateData: (props: Partial<Props>) => void;
}

export interface ResultPublicAPI<Props extends void, Result> extends BasePublicAPI {
  // returns promise that resolves when modal is closed with some data, ex intent is cerated, can be rejected by .close()
  open: (props?: Props) => Promise<Result>;
  // similar to open, but promise always resolved with Result or null if closed
  openVoid: (props?: Props) => Promise<Result | null>;
  updateData?: never;
}

export interface PropsResultPublicAPI<Props extends EmptyObject, Result> extends BasePublicAPI {
  // returns promise that resolves when modal is closed with some data, ex intent is cerated, can be rejected by .close()
  open: (props: Props) => Promise<Result>;
  // similar to open, but promise always resolved with Result or null if closed
  openVoid: (props: Props) => Promise<Result | null>;
  updateData: (props: Partial<Props>) => void;
}
