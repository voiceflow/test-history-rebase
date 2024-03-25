import type { ToJSON, ToObject } from '@/types';

import type { ProjectEntity } from './project.entity';

export type ProjectObject = ToObject<ProjectEntity>;
export type ProjectJSON = ToJSON<ProjectObject>;
