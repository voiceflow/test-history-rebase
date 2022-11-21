import { Utils } from '@voiceflow/common';

export const isKey = <T>(obj: T, key: string | keyof T): key is keyof T => Utils.object.hasProperty(obj, key);
