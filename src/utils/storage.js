/* eslint-disable no-underscore-dangle */
class Storage {
  __prefix__ = 'invocable:';

  __store__ = {};

  __storage__ = global.localStorage;

  __keysToMigrate__ = ['token', 'flashBriefingToUpload', 'projectToRedirectAfterAmazon'];

  __prefixToMigrate__ = 'storyline:';

  constructor() {
    this.__migrate();
  }

  __getKey(key) {
    return this.__prefix__ + key;
  }

  __migrate() {
    if (this.__storage__) {
      let migratedKeys = this.get('__migratedStoreKeys__') || '';

      this.__keysToMigrate__.forEach((key) => {
        const value = this.__storage__.getItem(`${this.__prefixToMigrate__}${key}`);

        if (value && !migratedKeys.includes(key)) {
          migratedKeys += `,${key}`;

          this.set(key, value);
          this.set('__migratedStoreKeys__', migratedKeys);

          this.__storage__.removeItem(`${this.__prefixToMigrate__}${key}`);
        }
      });
    }
  }

  get(key) {
    if (this.__storage__) {
      const value = this.__storage__.getItem(this.__getKey(key));

      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }

    return this.__store__[key];
  }

  set(key, value) {
    if (this.__storage__) {
      return this.__storage__.setItem(this.__getKey(key), JSON.stringify(value));
    }

    this.__store__[key] = value;
  }

  remove(key) {
    if (this.__storage__) {
      return this.__storage__.removeItem(this.__getKey(key));
    }

    delete this.__store__[key];
  }

  clearAll() {
    this.__store__ = {};

    this.__storage__ = global.localStorage;
  }
}

export default new Storage();
