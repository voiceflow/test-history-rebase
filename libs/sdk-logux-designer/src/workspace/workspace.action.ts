import { createCRUD } from '@/crud/crud.action';
import type {
  AddOneRequest,
  CreateResponse,
  DeleteOneRequest,
  PatchOneRequest,
  ReplaceRequest,
  UpdateOneRequest,
} from '@/crud/crud.interface';

import type { Workspace } from './workspace.interface';
import type { WorkspaceSettings } from './workspace-settings/workspace-settings.interface';

export const workspaceAction = createCRUD('workspace_v2');

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

  export interface Response extends CreateResponse<Workspace> {}
}

export const Create = workspaceAction.crud.createOne<Create.Request, Create.Response>();

export interface Add extends AddOneRequest<Workspace> {}

export const Add = workspaceAction.crud.addOne<Add>();

export interface PatchOne extends PatchOneRequest<Pick<Workspace, 'name' | 'image'>> {}

export const PatchOne = workspaceAction.crud.patchOne<PatchOne>();

export interface UpdateOne extends UpdateOneRequest<Workspace> {}

export const UpdateOne = workspaceAction.crud.updateOne<UpdateOne>();

export interface DeleteOne extends DeleteOneRequest {}

export const DeleteOne = workspaceAction.crud.deleteOne<DeleteOne>();

export interface Replace extends ReplaceRequest<Workspace> {}

export const Replace = workspaceAction.crud.replace<Replace>();
