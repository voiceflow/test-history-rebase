import { z } from 'nestjs-zod/z';

import { ObjectResource, ObjectResourceInternal } from './object-resource.dto';

export const TabularResource = ObjectResource.extend({
  name: z.string(),
  assistantID: z.string().uuid(),
  createdByID: z.number(),
  updatedByID: z.number(),
  folderID: z.string().uuid().nullable(),
});

export const TabularResourceInternal = TabularResource.extend(ObjectResourceInternal.shape);
