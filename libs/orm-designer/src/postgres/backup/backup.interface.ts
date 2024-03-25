import type { ToJSON, ToObject } from '@/types';

import type { BackupEntity } from './backup.entity';

export type BackupObject = ToObject<BackupEntity>;
export type BackupJSON = ToJSON<BackupObject>;
