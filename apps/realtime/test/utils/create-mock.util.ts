import type { Mock } from 'vitest';
import { vi } from 'vitest';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : unknown extends T[P]
        ? T[P]
        : DeepPartial<T[P]>;
};

export type PartialFuncReturn<T> = {
  [K in keyof T]?: T[K] extends (...args: infer A) => infer U
    ? (...args: A) => PartialFuncReturn<U>
    : DeepPartial<T[K]>;
};

export type DeepMocked<T> = {
  [Key in keyof T]: T[Key] extends (...args: infer A) => infer U
    ? Mock & ((...args: A) => DeepMocked<U>)
    : T[Key] extends object
      ? DeepMocked<T[Key]>
      : T[Key];
} & T;

export interface MockCreationOptions {
  name?: string;
}

const createDeepMockProxy = (propName: string): Mock => {
  const proxyObject = new Proxy({}, createDeepMockHandler(propName));

  return vi.fn(() => proxyObject);
};

const createDeepMockHandler = (propName: string) => {
  const propertyCache = new Map<PropertyKey, Mock | DeepPartial<unknown>>();

  return {
    get: (targetObject: DeepPartial<unknown>, prop: PropertyKey) => {
      if (propertyCache.has(prop)) {
        return propertyCache.get(prop);
      }

      const targetProperty = (targetObject as any)[prop];
      let mockedProperty;

      if (prop in targetObject) {
        mockedProperty = typeof targetProperty === 'function' ? vi.fn() : targetProperty;
      } else if (prop.toString() === 'then') {
        mockedProperty = undefined;
      } else {
        mockedProperty = createDeepMockProxy(propName);
      }

      propertyCache.set(prop, mockedProperty);

      return mockedProperty;
    },
  };
};

const createMockHandler = (name: string) => {
  const cache = new Map<PropertyKey, Mock | DeepPartial<unknown>>();

  return {
    get: (targetObject: DeepPartial<unknown>, prop: PropertyKey) => {
      if (
        prop === 'inspect' ||
        prop === 'then' ||
        (typeof prop === 'symbol' && prop.toString() === 'Symbol(util.inspect.custom)')
      ) {
        return undefined;
      }

      if (cache.has(prop)) {
        return cache.get(prop);
      }

      const targetProperty = (targetObject as any)[prop];
      let mockedProp;

      if (prop in targetObject) {
        if (typeof targetProperty === 'function') {
          mockedProp = vi.fn(() => {
            const result = targetProperty();

            return typeof result === 'function' ? vi.fn(result) : result;
          });
        } else {
          mockedProp = targetProperty;
        }
      } else if (prop === 'constructor') {
        mockedProp = () => undefined;
      } else {
        mockedProp = createDeepMockProxy(`${name}.${prop.toString()}`);
      }

      cache.set(prop, mockedProp);
      return mockedProp;
    },
  };
};

export const createMock = <T>(
  partialObject: PartialFuncReturn<T> = {},
  options: MockCreationOptions = {}
): DeepMocked<T> => {
  const { name = 'mock' } = options;
  const proxyObject = new Proxy(partialObject, createMockHandler(name));

  return proxyObject as DeepMocked<T>;
};
