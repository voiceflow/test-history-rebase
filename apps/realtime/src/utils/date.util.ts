import { Utils } from '@voiceflow/common';

const KEYS_CONTAINING_DATE = new Set(['createdAt', 'updatedAt', 'importedAt', 'deletedAt']);

export const deepSetNewDate = <T>(struct: T): T => {
  const now = new Date().toJSON();

  return Utils.object.deepMap<T>(struct, (value, key) =>
    typeof key === 'string' && KEYS_CONTAINING_DATE.has(key) ? now : value
  );
};
