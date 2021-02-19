import React from 'react';
import shallowEqual from 'shallowequal';

import { useTeardown } from '@/hooks';
import { objectID } from '@/utils';
import { append, withoutValue } from '@/utils/array';
import Logger from '@/utils/logger';

import type { Engine } from '..';
import { EntityType } from '../constants';

export type EntityInstance = {
  isReady: () => boolean;

  addClass: (className: string) => void;
  removeClass: (className: string) => void;
};

const isDirectlyEqual = <T>(lhs: T, rhs: T) => lhs === rhs;

export abstract class Entity<T extends EntityInstance = EntityInstance> {
  instanceID = objectID();

  classNames: string[] = [];

  handlers: ((entity: this) => any)[] = [];

  public instance: T | null = null;

  // eslint-disable-next-line no-useless-constructor
  constructor(protected type: EntityType, protected engine: Engine, protected log: typeof Logger) {}

  #addClass = (className: string) => {
    this.classNames = append(this.classNames, className);
    this.instance?.addClass(className);
  };

  #removeClass = (className: string) => {
    this.classNames = withoutValue(this.classNames, className);
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

  // eslint-disable-next-line class-methods-use-this
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

        if (!shallowEqual(nextValue, prevValue)) {
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
  useSubscription<T>(id: string, selector: () => T, isEqual: (lhs: T | null, rhs: T | null) => boolean = isDirectlyEqual) {
    let prevState: T | null = null;

    return this.engine.dispatcher.useSubscription(this.type, id, (isForced) => {
      const state = selector();

      this.log.debug(this.log.pending('redrawing'));

      if (isForced || !this.instance?.isReady() || !isEqual(state, prevState)) {
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
