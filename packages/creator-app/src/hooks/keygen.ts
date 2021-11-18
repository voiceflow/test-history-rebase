import { useCreateConst } from '@voiceflow/ui';
import _isString from 'lodash/isString';

import { generateLocalKey } from '@/utils/key';

const generateKey = (keygen: (value: any) => string, value: any): string => (_isString(value) ? value : keygen(value));

// eslint-disable-next-line import/prefer-default-export
export function useKeygen(): (value: any) => string {
  const keygen = useCreateConst(generateLocalKey);

  return (value: any) => generateKey(keygen, value);
}
