import type { ObjectResource } from './object-resource.interface';

export interface TabularResource extends ObjectResource {
  name: string;
  assistantID: string;
  createdByID: number;
  updatedByID: number;
  folderID: string | null;
}
