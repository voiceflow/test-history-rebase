import { createCRUD } from '@/crud/crud.action';
import type { AddOneRequest, CreateResponse, ReplaceRequest } from '@/crud/crud.interface';

import type { Version } from './version.interface';
import type { WorkspaceSettings } from './workspace-settings/workspace-settings.interface';

export const versionAction = createCRUD('version_v2');

export interface WorkspaceActionContext {
  workspaceID: string;
}

export interface WorkspaceAction {
  context: WorkspaceActionContext;
}

export namespace Create {
  export interface Request {
    name: string;
    image?: string;
    settings?: WorkspaceSettings;
    organizationID?: string;
  }

  export interface Response extends CreateResponse<Version> {}
}

export const Create = versionAction.crud.createOne<Create.Request, Create.Response>();

export interface Add extends AddOneRequest<Version> {}

export const Add = versionAction.crud.addOne<Add>();

export interface Replace extends ReplaceRequest<Version> {}

export const Replace = versionAction.crud.replace<Replace>();
