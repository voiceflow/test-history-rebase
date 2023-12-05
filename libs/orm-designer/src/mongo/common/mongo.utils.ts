/* eslint-disable no-param-reassign */
import { MetadataStorage } from '@mikro-orm/core';

export const cleanupUndefinedFields = <T extends Record<string, any>>(target: T) => {
  const meta = MetadataStorage.getMetadataFromDecorator<T>(target.constructor as any);

  for (const key in target) {
    if (
      Object.prototype.hasOwnProperty.call(target, key) &&
      target[key] === undefined &&
      meta.properties[key]?.nullable
    ) {
      if (meta.properties[key].default) {
        Object.assign(target, { [key]: meta.properties[key].default });
      } else {
        delete target[key];
      }
    }
  }
};
