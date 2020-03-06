import { IS_PRODUCTION } from '@/config';
import { identity } from '@/utils/functional';

export class AdapterNotImplementedError extends Error {
  constructor() {
    super('adapter not implemented');
  }
}

export interface Options {
  debug?: boolean;
}

export type Adapter<I, O> = (value: I, ...args: any[]) => O;

export const createSimpleAdapter = <DB, APP>(fromDB: Adapter<DB, APP>, toDB: Adapter<APP, DB>, options: Options = {}) => ({
  fromDB:
    !IS_PRODUCTION && options.debug
      ? (dbValue: DB, ...args: any[]) => {
          // eslint-disable-next-line no-console
          console.log('adapter called with value from DB:', dbValue);

          const result = fromDB(dbValue, ...args);

          // eslint-disable-next-line no-console
          console.log('converted DB value to:', result);

          return result;
        }
      : fromDB,
  toDB:
    !IS_PRODUCTION && options.debug
      ? (appValue: APP, ...args: any[]) => {
          // eslint-disable-next-line no-console
          console.log('adapter called with value from the store:', appValue);

          const result = toDB(appValue, ...args);

          // eslint-disable-next-line no-console
          console.log('converted store value to:', result);

          return result;
        }
      : toDB,
});

export const createAdapter = <DB, APP>(fromDB: Adapter<DB, APP>, toDB: Adapter<APP, DB>, options: Options = {}) => ({
  ...createSimpleAdapter(fromDB, toDB, options),
  mapFromDB: (dbValues: DB[]) => {
    if (!IS_PRODUCTION && options.debug) {
      // eslint-disable-next-line no-console
      console.log('adapter called with values from DB:', dbValues);
    }

    const result = dbValues.map(fromDB);

    if (!IS_PRODUCTION && options.debug) {
      // eslint-disable-next-line no-console
      console.log('converted DB values to:', result);
    }

    return result;
  },
  mapToDB: (appValues: APP[]) => {
    if (!IS_PRODUCTION && options.debug) {
      // eslint-disable-next-line no-console
      console.log('adapter called with values from store:', appValues);
    }

    const result = appValues.map(toDB);

    if (!IS_PRODUCTION && options.debug) {
      // eslint-disable-next-line no-console
      console.log('converted store values to:', result);
    }

    return result;
  },
});

export const identityAdapter = createSimpleAdapter(identity, identity);
