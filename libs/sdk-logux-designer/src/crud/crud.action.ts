import { protocol } from '@voiceflow/common';

export const createCRUD = (...path: string[]) => {
  const typeFactory = protocol.typeFactory(...path);

  return Object.assign(typeFactory, {
    crud: {
      createOne: <Request, Response>(...path: string[]) =>
        protocol.createAsyncAction<Request, Response>(typeFactory(protocol.typeFactory(...path)('CREATE_ONE'))),

      createMany: <Request, Response>(...path: string[]) =>
        protocol.createAsyncAction<Request, Response>(typeFactory(protocol.typeFactory(...path)('CREATE_MANY'))),

      query: <Request, Response>(...path: string[]) =>
        protocol.createAsyncAction<Request, Response>(typeFactory(protocol.typeFactory(...path)('QUERY'))),

      addOne: <Request>(...path: string[]) =>
        protocol.createAction<Request>(typeFactory(protocol.typeFactory(...path)('ADD_ONE'))),

      addMany: <Request>(...path: string[]) =>
        protocol.createAction<Request>(typeFactory(protocol.typeFactory(...path)('ADD_MANY'))),

      patchOne: <Request>(...path: string[]) =>
        protocol.createAction<Request>(typeFactory(protocol.typeFactory(...path)('PATCH_ONE'))),

      patchMany: <Request>(...path: string[]) =>
        protocol.createAction<Request>(typeFactory(protocol.typeFactory(...path)('PATCH_MANY'))),

      updateOne: <Request>(...path: string[]) =>
        protocol.createAction<Request>(typeFactory(protocol.typeFactory(...path)('UPDATE_ONE'))),

      updateMany: <Request>(...path: string[]) =>
        protocol.createAction<Request>(typeFactory(protocol.typeFactory(...path)('UPDATE_MANY'))),

      deleteOne: <Request>(...path: string[]) =>
        protocol.createAction<Request>(typeFactory(protocol.typeFactory(...path)('DELETE_ONE'))),

      deleteMany: <Request>(...path: string[]) =>
        protocol.createAction<Request>(typeFactory(protocol.typeFactory(...path)('DELETE_MANY'))),

      replace: <Request>(...path: string[]) =>
        protocol.createAction<Request>(typeFactory(protocol.typeFactory(...path)('REPLACE'))),
    },
  });
};
