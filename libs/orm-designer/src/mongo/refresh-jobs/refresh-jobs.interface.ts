import type { ToJSON, ToObject } from '@/types';

import type { RefreshJobsEntity } from './refresh-jobs.entity';

export type RefreshJobsObject = ToObject<RefreshJobsEntity>;
export type RefreshJobsJSON = ToJSON<RefreshJobsObject>;
