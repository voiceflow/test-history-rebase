import { IS_PRODUCTION } from '@/config';
import { identity } from '@/utils/functional';

export const createSimpleAdapter = (fromDB, toDB, options = {}) => ({
  fromDB:
    !IS_PRODUCTION && options.debug
      ? (dbValue, ...args) => {
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
      ? (appValue, ...args) => {
          // eslint-disable-next-line no-console
          console.log('adapter called with value from the store:', appValue);

          const result = fromDB(appValue, ...args);

          // eslint-disable-next-line no-console
          console.log('converted store value to:', result);

          return result;
        }
      : toDB,
});

export const createAdapter = (fromDB, toDB, options = {}) => ({
  ...createSimpleAdapter(fromDB, toDB, options),
  mapFromDB: (dbValues) => {
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
  mapToDB: (appValues) => {
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
