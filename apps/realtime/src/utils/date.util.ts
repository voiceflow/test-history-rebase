import { Utils } from '@voiceflow/common';

export const deepSetNewDate = <T>(struct: T): T => Utils.object.deepMap<T>(struct, (value) => (value instanceof Date ? new Date() : value));
