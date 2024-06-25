import type { WithRequired } from '@voiceflow/common';

export type PartialModel<T extends { id: string }> = WithRequired<Partial<T>, 'id'>;
