import type { ToJSON, ToObject } from '@/types';

import type { VersionEntity } from './version.entity';

export type VersionObject = ToObject<VersionEntity>;
export type VersionJSON = ToJSON<VersionObject>;
