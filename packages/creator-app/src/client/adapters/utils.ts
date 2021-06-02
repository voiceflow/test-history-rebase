import { IS_PRODUCTION } from '@/config';
import { identity } from '@/utils/functional';

import { clientLogger } from '../utils';

export const adapterLogger = clientLogger.child('adapter');

export class AdapterNotImplementedError extends Error {
  constructor() {
    super('adapter not implemented');
  }
}

export interface Options {
  debug?: boolean;
}

export type Adapter<I, A extends any[], O> = (value: I, ...args: A) => O;

export type BidirectionalAdapter<I, O, T extends any[], R extends any[]> = {
  fromDB: Adapter<I, T, O>;
  toDB: Adapter<O, R, I>;
};

export type AnyBidirectionalAdapter = BidirectionalAdapter<any, any, any[], any[]>;

export type BidirectionalMultiadapter<I, O, T extends any[], R extends any[]> = BidirectionalAdapter<I, O, T, R> & {
  mapFromDB: Adapter<I[], T, O[]>;
  mapToDB: Adapter<O[], R, I[]>;
};

export type AnyBidirectionalMultiadapter = BidirectionalMultiadapter<any, any, any[], any[]>;

export const createSimpleAdapter = <I, O, T extends any[] = [], R extends any[] = []>(
  fromDB: Adapter<I, T, O>,
  toDB: Adapter<O, R, I>,
  options: Options = {}
): BidirectionalAdapter<I, O, T, R> => ({
  fromDB:
    !IS_PRODUCTION && options.debug
      ? (dbValue, ...args) => {
          adapterLogger.debug('adapter called with value from DB', dbValue);

          const result = fromDB(dbValue, ...args);

          adapterLogger.debug('converted DB value to', result);

          return result;
        }
      : fromDB,
  toDB:
    !IS_PRODUCTION && options.debug
      ? (appValue, ...args) => {
          adapterLogger.debug('adapter called with value from the store', appValue);

          const result = toDB(appValue, ...args);

          adapterLogger.debug('converted store value to', result);

          return result;
        }
      : toDB,
});

export const createAdapter = <I, O, T extends any[] = [], R extends any[] = []>(
  fromDB: Adapter<I, T, O>,
  toDB: Adapter<O, R, I>,
  options: Options = {}
): BidirectionalMultiadapter<I, O, T, R> => ({
  ...createSimpleAdapter<I, O, T, R>(fromDB, toDB, options),
  mapFromDB: (dbValues, ...args) => {
    if (!IS_PRODUCTION && options.debug) {
      adapterLogger.debug('adapter called with values from DB', dbValues);
    }

    const result = dbValues.map((dbValue) => fromDB(dbValue, ...args));

    if (!IS_PRODUCTION && options.debug) {
      adapterLogger.debug('converted DB values to', result);
    }

    return result;
  },
  mapToDB: (appValues, ...args) => {
    if (!IS_PRODUCTION && options.debug) {
      adapterLogger.debug('adapter called with values from store', appValues);
    }

    const result = appValues.map((appValue) => toDB(appValue, ...args));

    if (!IS_PRODUCTION && options.debug) {
      adapterLogger.debug('converted store values to', result);
    }

    return result;
  },
});

export const identityAdapter: {
  fromDB: <T>(value: T) => T;
  toDB: <T>(value: T) => T;
} = createSimpleAdapter<any, any>(identity, identity);
