import { parseQuery } from '@voiceflow/ui';

import type { Query } from '@/models';

export { stringifyQuery as stringify } from '@voiceflow/ui';

export const parse = (search: string) => parseQuery<Query>(search);
