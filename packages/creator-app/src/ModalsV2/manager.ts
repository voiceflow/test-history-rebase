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
  data: AnyRecord;
}

export interface CloseRemoveEvent {
  id: string;
  type: string;
}

export interface UpdateEvent {
  id: string;
  type: string;
  payload: { data?: AnyRecord; closePrevented?: boolean };
}

interface Events {
  [Event.OPEN]: OpenEvent;

  [Event.CLOSE]: CloseRemoveEvent;

  [Event.UPDATE]: UpdateEvent;

  [Event.REMOVE]: CloseRemoveEvent;

  [Event.RELOAD]: void;
}

class Manager extends EventEmitter<Events> {
  private registry = new Map<string, React.FC<T.VoidInternalProps> | React.FC<AnyRecord & T.ResultInternalProps<any>>>();

  private modalPromises = new Map<string, Promise<any>>();

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
      if (IS_DEVELOPMENT) {
        logger.warn(`A modal "${type}" is already registered!`);
      } else {
        throw new Error(`A modal "${type}" is already registered!`);
      }
    }

    this.registry.set(type, component);
  }

  unregister(type: string): void {
    this.registry.delete(type);
  }

  // needs to use factory to make HMR work
  create<Props extends void>(factory: () => React.FC<Props & T.VoidInternalProps>): T.RegisteredModal<Props & T.VoidInternalProps>;

  create<Props extends void>(type: string, factory: () => React.FC<Props & T.VoidInternalProps>): T.RegisteredModal<Props & T.VoidInternalProps>;

  create<Props extends EmptyObject>(factory: () => React.FC<Props & T.VoidInternalProps>): T.RegisteredModal<Props & T.VoidInternalProps>;

  create<Props extends EmptyObject>(
    type: string,
    factory: () => React.FC<Props & T.VoidInternalProps>
  ): T.RegisteredModal<Props & T.VoidInternalProps>;

  create<Props extends void, Result>(
    factory: () => React.FC<Props & T.ResultInternalProps<Result>>
  ): T.RegisteredModal<Props & T.ResultInternalProps<Result>>;

  create<Props extends void, Result>(
    type: string,
    factory: () => React.FC<Props & T.ResultInternalProps<Result>>
  ): T.RegisteredModal<Props & T.ResultInternalProps<Result>>;

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

  open<Result>(id: string, type: string): Promise<Result>;

  open<Result>(id: string, modal: T.RegisteredModal<T.VoidInternalProps>): Promise<Result>;

  open<Props extends EmptyObject>(id: string, type: string, data: Props): Promise<void>;

  open<Props extends EmptyObject>(id: string, modal: T.RegisteredModal<Props & T.VoidInternalProps>, data: Props): Promise<void>;

  open<Props extends EmptyObject, Result>(id: string, type: string, data: Props): Promise<Result>;

  open<Props extends EmptyObject, Result>(id: string, modal: T.RegisteredModal<Props & T.ResultInternalProps<Result>>, data: Props): void;

  open(id: string, type: string): Promise<void>;

  open(id: string, modal: T.RegisteredModal<T.VoidInternalProps>): Promise<void>;

  open(
    ...args:
      | [id: string, type: string]
      | [id: string, modal: T.RegisteredModal<T.VoidInternalProps>]
      | [id: string, type: string, data: unknown]
      | [id: string, modal: T.RegisteredModal<unknown & T.ResultInternalProps<unknown>>, data: unknown]
  ): Promise<unknown> {
    const [id, modal, data = {}] = args;
    const type = typeof modal === 'string' ? modal : modal.__vfModalType;
    const combinedID = this.getCombinedID(id, type);

    if (this.modalPromises.has(combinedID)) {
      logger.warn(`Modal "${combinedID}" is already opened.`);

      return this.modalPromises.get(combinedID)!;
    }

    let _reject!: (error: Error) => void;
    let _resolve!: (data: unknown) => void;

    const promise = new Promise<unknown>((resolve, reject) => {
      _reject = reject;
      _resolve = resolve;
    });

    this.modalPromises.set(combinedID, promise);

    this.emit(Event.OPEN, {
      id,
      type,
      data,
      api: {
        close: () => {
          this.emit(Event.CLOSE, { id, type });
        },

        remove: () => {
          this.modalPromises.delete(combinedID);

          this.emit(Event.REMOVE, { id, type });

          _reject(new Error('Modal was closed!'));
        },

        resolve: (data: unknown) => {
          this.modalPromises.delete(combinedID);

          _resolve(data);
        },

        reject: (error: Error) => {
          this.modalPromises.delete(combinedID);

          _reject(error);
        },

        enableClose: () => this.enableClose(id, type),

        preventClose: () => this.preventClose(id, type),
      },
    });

    return promise;
  }

  close(id: string, type: string): Promise<void>;

  close(id: string, modal: T.RegisteredModal<any>): Promise<void>;

  close(...args: [id: string, type: string] | [id: string, modal: T.RegisteredModal<any>]): Promise<void> {
    const [id, modal] = args;
    const type = typeof modal === 'string' ? modal : modal.__vfModalType;

    const combinedID = this.getCombinedID(id, type);

    if (!this.modalPromises.has(combinedID)) {
      logger.warn(`Modal "${combinedID}" is not opened yet.`);

      return Promise.resolve();
    }

    this.emit(Event.CLOSE, { id, type });

    return this.modalPromises.get(combinedID)!.then(Utils.functional.noop, Utils.functional.noop);
  }

  update<Props extends EmptyObject>(id: string, type: string, data: Partial<Props>): void;

  update<Props extends EmptyObject>(id: string, modal: T.RegisteredModal<Props & T.VoidInternalProps>, data: Partial<Props>): void;

  update(...args: [id: string, type: string, data: unknown] | [id: string, modal: T.RegisteredModal<T.VoidInternalProps>, data: unknown]): void {
    const [id, modal, data = {}] = args;
    const type = typeof modal === 'string' ? modal : modal.__vfModalType;
    const combinedID = this.getCombinedID(id, type);

    if (!this.modalPromises.has(combinedID)) {
      logger.warn(`Modal "${combinedID}" is not opened yet.`);

      return;
    }

    this.emit(Event.UPDATE, { id, type, payload: { data } });
  }

  enableClose(id: string, type: string): void {
    this.emit(Event.UPDATE, { id, type, payload: { closePrevented: false } });
  }

  preventClose(id: string, type: string): void {
    this.emit(Event.UPDATE, { id, type, payload: { closePrevented: true } });
  }
}

export default new Manager();
