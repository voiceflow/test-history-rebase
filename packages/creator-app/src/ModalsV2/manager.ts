import { AnyRecord, EmptyObject, Utils } from '@voiceflow/common';
import EventEmitter from 'eventemitter3';
import React from 'react';

import { IS_DEVELOPMENT } from '@/config';
import logger from '@/utils/logger';

import * as T from './types';

export enum Event {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
  RELOAD = 'RELOAD',
}

export interface OpenEvent {
  id: string;
  api: T.ResultInternalAPI<unknown>;
  type: string;
  props: AnyRecord;
  options?: T.OpenOptions;
}

export interface CloseRemoveEvent {
  id: string;
  type: string;
}

export interface UpdateEvent {
  id: string;
  type: string;
  payload: { props?: AnyRecord; closePrevented?: boolean };
}

interface Events {
  [Event.OPEN]: OpenEvent;

  [Event.CLOSE]: CloseRemoveEvent;

  [Event.UPDATE]: UpdateEvent;

  [Event.REMOVE]: CloseRemoveEvent;

  [Event.RELOAD]: void;
}

interface OpenedModal {
  id: string;
  api: T.ResultInternalAPI<unknown>;
  type: string;
  props: AnyRecord;
  promise: Promise<any>;
  _reject: (error: Error) => void;
  _resolve: (data: unknown) => void;
}

class Manager extends EventEmitter<Events> {
  private registry = new Map<string, React.FC<T.VoidInternalProps> | React.FC<AnyRecord & T.ResultInternalProps<any>>>();

  private openedModals = new Map<string, OpenedModal>();

  emit<K extends keyof Events>(event: K, ...args: Events[K] extends void ? [] : [Events[K]]): boolean {
    return super.emit(event, ...args);
  }

  getCombinedID(id: string, type: string): string {
    return `${type}:${id}`;
  }

  get(type: string): React.FC<T.VoidInternalProps> | React.FC<AnyRecord & T.ResultInternalProps<any>> | null {
    return this.registry.get(type) ?? null;
  }

  register<Props extends EmptyObject>(type: string, Component: React.FC<Props & T.VoidInternalProps>): void;

  register<Props extends void, Result>(type: string, Component: React.FC<Props & T.ResultInternalProps<Result>>): void;

  register<Props extends EmptyObject, Result>(type: string, Component: React.FC<Props & T.ResultInternalProps<Result>>): void;

  register(type: string, component: React.FC<T.VoidInternalProps>): void;

  register(type: string, component: React.FC<T.VoidInternalProps> | React.FC<AnyRecord & T.ResultInternalProps<any>>): void {
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
  create<Props extends void>(
    factory: () => React.FC<T.VoidInternalProps & { _void?: Props }>
  ): T.RegisteredModal<T.VoidInternalProps & { _void?: Props }>;

  create<Props extends void>(
    type: string,
    factory: () => React.FC<T.VoidInternalProps & { _void?: Props }>
  ): T.RegisteredModal<T.VoidInternalProps & { _void?: Props }>;

  create<Props extends EmptyObject>(factory: () => React.FC<Props & T.VoidInternalProps>): T.RegisteredModal<Props & T.VoidInternalProps>;

  create<Props extends EmptyObject>(
    type: string,
    factory: () => React.FC<Props & T.VoidInternalProps>
  ): T.RegisteredModal<Props & T.VoidInternalProps>;

  create<Props extends void, Result>(
    factory: () => React.FC<T.ResultInternalProps<Result> & { _void?: Props }>
  ): T.RegisteredModal<T.ResultInternalProps<Result> & { _void?: Props }>;

  create<Props extends void, Result>(
    type: string,
    factory: () => React.FC<T.ResultInternalProps<Result> & { _void?: Props }>
  ): T.RegisteredModal<T.ResultInternalProps<Result> & { _void?: Props }>;

  create<Props extends EmptyObject, Result>(
    factory: () => React.FC<Props & T.ResultInternalProps<Result>>
  ): T.RegisteredModal<Props & T.ResultInternalProps<Result>>;

  create<Props extends EmptyObject, Result>(
    type: string,
    factory: () => React.FC<Props & T.ResultInternalProps<Result>>
  ): T.RegisteredModal<Props & T.ResultInternalProps<Result>>;

  create(factory: () => React.FC<T.VoidInternalProps>): T.RegisteredModal<T.VoidInternalProps>;

  create(type: string, factory: () => React.FC<T.VoidInternalProps>): T.RegisteredModal<T.VoidInternalProps>;

  create(
    ...args:
      | [factory: () => React.FC<T.VoidInternalProps> | React.FC<AnyRecord & T.ResultInternalProps<any>>]
      | [type: string, factory: () => React.FC<T.VoidInternalProps> | React.FC<AnyRecord & T.ResultInternalProps<any>>]
  ): T.RegisteredModal<T.ResultInternalProps<any>> | T.RegisteredModal<T.VoidInternalProps> {
    const [type, factory] = args.length === 1 ? [Utils.id.cuid.slug(), args[0]] : args;

    const MemoizedComponent = React.memo(factory());

    this.register(type, MemoizedComponent);

    return Object.assign(MemoizedComponent, { __vfModalType: type });
  }

  open<Result>(id: string, type: string, options?: { options?: T.OpenOptions }): Promise<Result>;

  open<Result>(id: string, modal: T.RegisteredModal<T.VoidInternalProps>, options?: { options?: T.OpenOptions }): Promise<Result>;

  open<Props extends EmptyObject>(id: string, type: string, options: { props: Props; options?: T.OpenOptions }): Promise<void>;

  open<Props extends EmptyObject>(
    id: string,
    modal: T.RegisteredModal<Props & T.VoidInternalProps>,
    options: { props: Props; options?: T.OpenOptions }
  ): Promise<void>;

  open<Props extends EmptyObject, Result>(id: string, type: string, options: { props: Props; options?: T.OpenOptions }): Promise<Result>;

  open<Props extends EmptyObject, Result>(
    id: string,
    modal: T.RegisteredModal<Props & T.ResultInternalProps<Result>>,
    options: { props: Props; options?: T.OpenOptions }
  ): void;

  open(id: string, type: string, options?: { options?: T.OpenOptions }): Promise<void>;

  open(id: string, modal: T.RegisteredModal<T.VoidInternalProps>, options?: { options?: T.OpenOptions }): Promise<void>;

  open(
    ...args:
      | [id: string, type: string, options?: { props?: never; options?: T.OpenOptions }]
      | [id: string, modal: T.RegisteredModal<T.VoidInternalProps>, options?: { props?: never; options?: T.OpenOptions }]
      | [id: string, type: string, options: { props: AnyRecord; options?: T.OpenOptions }]
      | [id: string, modal: T.RegisteredModal<unknown & T.ResultInternalProps<unknown>>, options: { props: AnyRecord; options?: T.OpenOptions }]
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

        this.emit(Event.REMOVE, { id, type });
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
        close: () => this.close(id, type),

        remove: () => this.remove(id, type),

        reject: _reject,

        resolve: _resolve,

        enableClose: () => this.enableClose(id, type),

        preventClose: () => this.preventClose(id, type),
      },
    };

    this.openedModals.set(combinedID, { ...openEvent, promise, _reject, _resolve });

    this.emit(Event.OPEN, openEvent);

    return promise;
  }

  close(id: string, type: string): Promise<void>;

  close(id: string, modal: T.RegisteredModal<any>): Promise<void>;

  close(...args: [id: string, type: string] | [id: string, modal: T.RegisteredModal<any>]): Promise<void> {
    const [id, modal] = args;
    const type = typeof modal === 'string' ? modal : modal.__vfModalType;

    const combinedID = this.getCombinedID(id, type);

    if (!this.openedModals.has(combinedID)) {
      logger.warn(`Modal "${combinedID}" is not opened yet.`);

      return Promise.resolve();
    }

    this.emit(Event.CLOSE, { id, type });

    return this.openedModals.get(combinedID)!.promise.then(Utils.functional.noop, Utils.functional.noop);
  }

  update<Props extends EmptyObject>(id: string, type: string, props: Partial<Props>): void;

  update<Props extends EmptyObject>(id: string, modal: T.RegisteredModal<Props & T.VoidInternalProps>, props: Partial<Props>): void;

  update(
    ...args: [id: string, type: string, props: AnyRecord] | [id: string, modal: T.RegisteredModal<T.VoidInternalProps>, props: AnyRecord]
  ): void {
    const [id, modal, props = {}] = args;
    const type = typeof modal === 'string' ? modal : modal.__vfModalType;
    const combinedID = this.getCombinedID(id, type);

    if (!this.openedModals.has(combinedID)) {
      logger.warn(`Modal "${combinedID}" is not opened yet.`);

      return;
    }

    this.emit(Event.UPDATE, { id, type, payload: { props } });
  }

  remove(id: string, type: string) {
    const combinedID = this.getCombinedID(id, type);

    const openedModel = this.openedModals.get(combinedID);

    if (!openedModel) {
      logger.warn(`Modal "${combinedID}" is not opened yet.`);

      return;
    }

    this.openedModals.delete(combinedID);

    this.emit(Event.REMOVE, { id, type });

    openedModel._reject(new Error('Modal was closed!'));
  }

  enableClose(id: string, type: string): void {
    this.emit(Event.UPDATE, { id, type, payload: { closePrevented: false } });
  }

  preventClose(id: string, type: string): void {
    this.emit(Event.UPDATE, { id, type, payload: { closePrevented: true } });
  }
}

export default new Manager();
