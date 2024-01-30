import { AnyRecord, EmptyObject, Utils } from '@voiceflow/common';
import { Enum } from '@voiceflow/dtos';
import { usePersistFunction } from '@voiceflow/ui-next';
import EventEmitter from 'eventemitter3';
import React from 'react';

import { IS_DEVELOPMENT } from '@/config';
import logger from '@/utils/logger';

import * as T from './types';

export const Event = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
  RELOAD: 'RELOAD',
  ADD_CLOSE_REQUEST_HANDLER: 'ADD_CLOSE_REQUEST_HANDLER',
  REMOVE_CLOSE_REQUEST_HANDLER: 'REMOVE_CLOSE_REQUEST_HANDLER',
} as const;

export type Event = Enum<typeof Event>;

export interface OpenEvent {
  id: string;
  api: T.ResultInternalAPI<unknown, unknown>;
  type: string;
  props: AnyRecord;
  options?: T.OpenOptions;
}

export interface CloseRemoveEvent {
  id: string;
  type: string;
  source: T.CloseSource;
}

export interface UpdateEvent {
  id: string;
  type: string;
  payload: { props?: AnyRecord; reopen?: boolean; closePrevented?: boolean };
}

export interface AddRemoveCloseRequestHandlerEvent {
  id: string;
  type: string;
  payload: (source: T.CloseSource) => boolean;
}

interface Events {
  [Event.OPEN]: OpenEvent;

  [Event.CLOSE]: CloseRemoveEvent;

  [Event.UPDATE]: UpdateEvent;

  [Event.REMOVE]: CloseRemoveEvent;

  [Event.RELOAD]: void;

  [Event.ADD_CLOSE_REQUEST_HANDLER]: AddRemoveCloseRequestHandlerEvent;

  [Event.REMOVE_CLOSE_REQUEST_HANDLER]: AddRemoveCloseRequestHandlerEvent;
}

interface OpenedModal {
  id: string;
  api: T.ResultInternalAPI<unknown, unknown>;
  type: string;
  props: AnyRecord;
  promise: Promise<any>;
  _reject: (error: Error) => void;
  _resolve: (data: unknown) => void;
}

class Manager extends EventEmitter<Events> {
  private registry = new Map<string, React.FC<T.VoidInternalProps<AnyRecord>> | React.FC<T.ResultInternalProps<any, AnyRecord>>>();

  private openedModals = new Map<string, OpenedModal>();

  emit<K extends keyof Events>(event: K, ...args: Events[K] extends void ? [] : [Events[K]]): boolean {
    return super.emit(event, ...args);
  }

  getCombinedID(id: string, type: string): string {
    return `${type}:${id}`;
  }

  get(type: string): React.FC<T.VoidInternalProps<AnyRecord>> | React.FC<T.ResultInternalProps<any, AnyRecord>> | null {
    return this.registry.get(type) ?? null;
  }

  register<Props extends EmptyObject>(type: string, Component: React.FC<T.VoidInternalProps<Props>>): void;

  register<Props extends void, Result>(type: string, Component: React.FC<T.ResultInternalProps<Result, Props>>): void;

  register<Props extends EmptyObject, Result>(type: string, Component: React.FC<T.ResultInternalProps<Result, Props>>): void;

  register(type: string, component: React.FC<T.VoidInternalProps<AnyRecord>>): void;

  register(type: string, component: React.FC<T.VoidInternalProps<AnyRecord>> | React.FC<T.ResultInternalProps<any, AnyRecord>>): void {
    logger.log(type, component);

    if (this.registry.has(type)) {
      // enable hot reload
      if (IS_DEVELOPMENT) {
        logger.warn(`A modal "${type}" is already registered!`);
        this.registry.set(type, component);
        this.emit(Event.RELOAD);
        return;
      }

      throw new Error(`A modal "${type}" is already registered!`);
    }

    this.registry.set(type, component);
  }

  unregister(type: string): void {
    this.registry.delete(type);
  }

  // needs to use factory to make HMR work

  create(factory: () => React.FC<T.VoidInternalProps>): T.RegisteredModal<T.VoidInternalProps>;

  create(type: string, factory: () => React.FC<T.VoidInternalProps>): T.RegisteredModal<T.VoidInternalProps>;

  create<Props extends EmptyObject>(factory: () => React.FC<T.VoidInternalProps<Props>>): T.RegisteredModal<T.VoidInternalProps<Props>, Props>;

  create<Props extends EmptyObject>(
    type: string,
    factory: () => React.FC<T.VoidInternalProps<Props>>
  ): T.RegisteredModal<T.VoidInternalProps<Props>, Props>;

  create<Props extends void, Result>(
    factory: () => React.FC<T.ResultInternalProps<Result, Props>>
  ): T.RegisteredModal<T.ResultInternalProps<Result, Props>, Props, Result>;

  create<Props extends void, Result>(
    type: string,
    factory: () => React.FC<T.ResultInternalProps<Result, Props>>
  ): T.RegisteredModal<T.ResultInternalProps<Result, Props>, Props, Result>;

  create<Props extends EmptyObject, Result>(
    factory: () => React.FC<T.ResultInternalProps<Result, Props>>
  ): T.RegisteredModal<T.ResultInternalProps<Result, Props>, Props, Result>;

  create<Props extends EmptyObject, Result>(
    type: string,
    factory: () => React.FC<T.ResultInternalProps<Result, Props>>
  ): T.RegisteredModal<T.ResultInternalProps<Result, Props>, Props, Result>;

  create(
    ...args:
      | [factory: () => React.FC<T.VoidInternalProps> | React.FC<T.VoidInternalProps<AnyRecord>> | React.FC<T.ResultInternalProps<any, AnyRecord>>]
      | [
          type: string,
          factory: () => React.FC<T.VoidInternalProps> | React.FC<T.VoidInternalProps<AnyRecord>> | React.FC<T.ResultInternalProps<any, AnyRecord>>
        ]
  ):
    | T.RegisteredModal<T.VoidInternalProps>
    | T.RegisteredModal<T.ResultInternalProps<AnyRecord, any>>
    | T.RegisteredModal<T.VoidInternalProps<AnyRecord>> {
    const [type, factory] = args.length === 1 ? [Utils.id.cuid.slug(), args[0]] : args;

    const MemoizedComponent = React.memo(factory());

    this.register(type, MemoizedComponent);

    return Object.assign(MemoizedComponent, { __vfModalType: type } as any);
  }

  open<Result>(id: string, type: string, options?: { options?: T.OpenOptions }): Promise<Result>;

  open<Result>(id: string, modal: T.RegisteredModal<T.VoidInternalProps>, options?: { options?: T.OpenOptions }): Promise<Result>;

  open<Props extends EmptyObject>(id: string, type: string, options: { props: Props; options?: T.OpenOptions }): Promise<void>;

  open<Props extends EmptyObject>(
    id: string,
    modal: T.RegisteredModal<T.VoidInternalProps<Props>, Props>,
    options: { props: Props; options?: T.OpenOptions }
  ): Promise<void>;

  open<Props extends EmptyObject, Result>(id: string, type: string, options: { props: Props; options?: T.OpenOptions }): Promise<Result>;

  open<Props extends EmptyObject, Result>(
    id: string,
    modal: T.RegisteredModal<T.ResultInternalProps<Result, Props>, Props, Result>,
    options: { props: Props; options?: T.OpenOptions }
  ): void;

  open(id: string, type: string, options?: { options?: T.OpenOptions }): Promise<void>;

  open(id: string, modal: T.RegisteredModal<T.VoidInternalProps>, options?: { options?: T.OpenOptions }): Promise<void>;

  open(
    ...args:
      | [id: string, type: string, options?: { props?: never; options?: T.OpenOptions }]
      | [id: string, modal: T.RegisteredModal<T.VoidInternalProps, any>, options?: { props?: never; options?: T.OpenOptions }]
      | [id: string, type: string, options: { props: AnyRecord; options?: T.OpenOptions }]
      | [
          id: string,
          modal: T.RegisteredModal<T.ResultInternalProps<unknown, unknown>, any, any>,
          options: { props: AnyRecord; options?: T.OpenOptions }
        ]
  ): Promise<unknown> {
    const [id, modal, { props = {}, options = {} } = {}] = args;
    const type = typeof modal === 'string' ? modal : modal.__vfModalType;
    const combinedID = this.getCombinedID(id, type);

    let promise!: Promise<unknown>;
    let _reject!: (error: Error) => void;
    let _resolve!: (data: unknown) => void;

    if (this.openedModals.has(combinedID)) {
      const openedModel = this.openedModals.get(combinedID)!;

      if (options.reopen) {
        promise = openedModel.promise;
        _reject = openedModel._reject;
        _resolve = openedModel._resolve;

        this.emit(Event.REMOVE, { id, type, source: 'api' });
      } else {
        logger.warn(`Modal "${combinedID}" is already opened.`);

        return openedModel.promise;
      }
    } else {
      promise = new Promise<unknown>((resolve, reject) => {
        _reject = reject;
        _resolve = resolve;
      });
    }

    const openEvent: OpenEvent = {
      id,
      type,
      props,
      options,
      api: {
        close: (source: T.CloseSource = 'api') => this.close(id, type, source),

        remove: () => this.remove(id, type),

        reject: _reject,

        resolve: _resolve,

        onClose: () => this.close(id, type, 'api'),

        onEscClose: () => this.close(id, type, 'esc'),

        enableClose: () => this.enableClose(id, type),

        preventClose: () => this.preventClose(id, type),

        updateProps: (props: any, options?: { reopen?: boolean }) => this.update(id, type, props, options),

        useOnCloseRequest: (callback: (source: T.CloseSource) => boolean) => {
          const persistedCallback = usePersistFunction(callback);

          React.useEffect(() => {
            this.emit(Event.ADD_CLOSE_REQUEST_HANDLER, { id, type, payload: persistedCallback });

            return () => {
              this.emit(Event.REMOVE_CLOSE_REQUEST_HANDLER, { id, type, payload: persistedCallback });
            };
          }, []);
        },
      },
    };

    this.openedModals.set(combinedID, { ...openEvent, promise, _reject, _resolve });

    this.emit(Event.OPEN, openEvent);

    return promise;
  }

  close(id: string, type: string, source: T.CloseSource): Promise<void>;

  close(id: string, modal: T.RegisteredModal<any>, source: T.CloseSource): Promise<void>;

  close(
    ...args: [id: string, type: string, source: T.CloseSource] | [id: string, modal: T.RegisteredModal<any>, source: T.CloseSource]
  ): Promise<void> {
    const [id, modal, source] = args;
    const type = typeof modal === 'string' ? modal : modal.__vfModalType;

    const combinedID = this.getCombinedID(id, type);

    if (!this.openedModals.has(combinedID)) {
      logger.warn(`Modal "${combinedID}" is not opened yet.`);

      return Promise.resolve();
    }

    this.emit(Event.CLOSE, { id, type, source });

    return this.openedModals.get(combinedID)!.promise.then(Utils.functional.noop, Utils.functional.noop);
  }

  update<Props extends EmptyObject>(id: string, type: string, props: Partial<Props>, options?: { reopen?: boolean }): void;

  update<Props extends EmptyObject>(
    id: string,
    modal: T.RegisteredModal<T.VoidInternalProps<Props>>,
    props: Partial<Props>,
    options?: { reopen?: boolean }
  ): void;

  update(
    ...args:
      | [id: string, type: string, props: AnyRecord, options?: { reopen?: boolean }]
      | [id: string, modal: T.RegisteredModal<T.VoidInternalProps<AnyRecord>>, props: AnyRecord, options?: { reopen?: boolean }]
  ): void {
    const [id, modal, props = {}, options] = args;
    const type = typeof modal === 'string' ? modal : modal.__vfModalType;
    const combinedID = this.getCombinedID(id, type);

    if (!this.openedModals.has(combinedID)) {
      logger.warn(`Modal "${combinedID}" is not opened yet.`);

      return;
    }

    this.emit(Event.UPDATE, { id, type, payload: { ...options, props } });
  }

  remove(id: string, type: string) {
    const combinedID = this.getCombinedID(id, type);

    const openedModel = this.openedModals.get(combinedID);

    if (!openedModel) {
      logger.warn(`Modal "${combinedID}" is not opened yet.`);

      return;
    }

    this.openedModals.delete(combinedID);

    this.emit(Event.REMOVE, { id, type, source: 'api' });

    openedModel._reject(new Error('Modal was closed!'));
  }

  enableClose(id: string, type: string): void {
    this.emit(Event.UPDATE, { id, type, payload: { closePrevented: false } });
  }

  preventClose(id: string, type: string): void {
    this.emit(Event.UPDATE, { id, type, payload: { closePrevented: true } });
  }
}

export const modalsManager = new Manager();

export default modalsManager;
