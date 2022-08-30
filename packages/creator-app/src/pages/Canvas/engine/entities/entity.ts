/* eslint-disable max-classes-per-file */
import { Utils } from '@voiceflow/common';
import { logger } from '@voiceflow/ui';
import React from 'react';

import { useTeardown } from '@/hooks';

import type Engine from '..';
import { EntityType } from '../constants';

export interface EntityInstance {
  isReady: () => boolean;

  addClass: (className: string) => void;
  removeClass: (className: string) => void;
}

export const isDirectlyEqual = <T>(lhs: T, rhs: T) => lhs === rhs;

export abstract class Entity<T extends EntityInstance = EntityInstance> {
  instanceID = Utils.id.objectID();

  classNames: string[] = [];

  handlers: ((entity: this) => any)[] = [];

  public instance: T | null = null;

  constructor(protected type: EntityType, protected engine: Engine, protected log: typeof logger) {}

  #addClass = (className: string) => {
    this.classNames = Utils.array.append(this.classNames, className);
    this.instance?.addClass(className);
  };

  #removeClass = (className: string) => {
    this.classNames = Utils.array.withoutValue(this.classNames, className);
    this.instance?.removeClass(className);
  };

  useInstance(instance: T) {
    React.useEffect(() => {
      this.instance = instance;
      this.classNames.forEach((className) => this.instance?.addClass(className));
    }, [instance]);

    useTeardown(() => {
      this.instance = null;
    });
  }

  isReady() {
    return !!this.instance?.isReady();
  }

  shouldUpdate() {
    return true;
  }

  useState<T extends object>(selector: (entity: this) => T) {
    const [value, setValue] = React.useState(() => selector(this));

    const handler = React.useMemo(() => {
      let prevValue = value;

      this.log.debug('selected', this.log.value(value));

      return () => {
        if (!this.shouldUpdate()) return;

        const nextValue = selector(this);

        this.log.debug(this.log.pending('reselecting'), nextValue);

        if (!Utils.object.shallowEquals(nextValue, prevValue)) {
          this.log.debug(this.log.success('selection updated'), this.log.diff(prevValue, nextValue));
          setValue(nextValue);
        }

        prevValue = nextValue;
      };
    }, []);

    React.useEffect(() => {
      this.handlers.push(handler);

      return () => {
        this.handlers.splice(this.handlers.indexOf(handler), 1);
      };
    }, []);

    return value;
  }

  useConditionalStyle(className: string, isActive: boolean) {
    React.useEffect(() => {
      if (isActive) {
        this.#addClass(className);
      } else {
        this.#removeClass(className);
      }
    }, [isActive]);

    useTeardown(() => this.#removeClass(className));
  }
}

export abstract class ResourceEntity<M, T extends EntityInstance = EntityInstance> extends Entity<T> {
  isEqual: (lhs: M | null, rhs: M | null) => boolean = isDirectlyEqual;

  useSubscription(id: string) {
    let prevState: M | null = null;

    return this.engine.dispatcher.useSubscription(this.type, id, (isForced) => {
      const state = this.resolve();

      this.log.debug(this.log.pending('redrawing'));

      if (isForced || !this.instance?.isReady() || !this.isEqual(state, prevState)) {
        this.handlers.forEach((handler) => handler(this));
        prevState = state;

        this.log.debug(this.log.success('redraw complete'), this.log.value(this.handlers.length));
      } else {
        this.log.debug(this.log.failure('redraw skipped'));
      }
    });
  }

  shouldUpdate() {
    return !!this.resolve();
  }

  abstract resolve(): M;
}

export default Entity;
