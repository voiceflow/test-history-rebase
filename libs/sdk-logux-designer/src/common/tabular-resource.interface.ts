import type { ObjectResource } from './object-resource.interface';

export interface TabularResource extends ObjectResource {
  name: string;
  folderID: string | null;
  assistantID: string;
  createdByID: number;
  updatedByID: number;
  environmentID: string;
}
