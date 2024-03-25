import type { ToJSON, ToObject } from '@/types';

import type { WorkspaceProjectListsEntity } from './workspace-project-lists.entity';

export type WorkspaceProjectListsObject = ToObject<WorkspaceProjectListsEntity>;
export type WorkspaceProjectListsJSON = ToJSON<WorkspaceProjectListsObject>;
