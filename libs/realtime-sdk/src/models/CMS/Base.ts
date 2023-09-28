export interface BaseResource {
  id: string;
}

export interface ObjectResource extends BaseResource {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export enum Language {
  ENGLISH_US = 'en-us',
}
