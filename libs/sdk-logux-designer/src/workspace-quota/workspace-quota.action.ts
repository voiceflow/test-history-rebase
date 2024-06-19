import { Quota } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type { ReplaceRequest } from '@/crud/crud.interface';

import { WorkspaceQuotaAction } from './workspace-quota.types';

export const workspaceQuotaAction = createCRUD('workspace_quota');

/* Replace */

export interface Replace extends ReplaceRequest<Quota>, WorkspaceQuotaAction {}

export const Replace = workspaceQuotaAction.crud.replace<Replace>();
