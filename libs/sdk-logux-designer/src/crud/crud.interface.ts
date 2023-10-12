export interface CreateResponse<Type> {
  data: Type;
}

export interface QueryRequest {
  offset?: number;
  limit?: number;
}

export interface QueryResponse<Type> {
  data: Type[];
}

export interface PatchOneRequest<Patch extends object> {
  id: string;
  patch: Patch;
}

export interface PatchManyRequest<Patch extends object> {
  ids: string[];
  patch: Patch;
}

export interface UpdateOneRequest<Type> {
  update: Type;
}

export interface UpdateManyRequest<Type> {
  update: Type[];
}

export interface DeleteOneRequest {
  id: string;
}

export interface DeleteManyRequest {
  ids: string[];
}

export interface ReplaceRequest<Type> {
  data: Type[];
}

export interface AddOneRequest<Type> {
  data: Type;
}

export interface AddManyRequest<Type> {
  data: Type[];
}
