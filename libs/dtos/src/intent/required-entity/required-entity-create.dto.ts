import { z } from 'zod';

import { AnyResponseVariantCreateDTO } from '@/response/response-variant/response-variant-create.dto';

import { RequiredEntityDTO } from './required-entity.dto';

const BaseRequiredEntityCreateDTO = RequiredEntityDTO.pick({ entityID: true }).strict();

export const RequiredEntityCreateDTO = z.union([
  BaseRequiredEntityCreateDTO.extend(RequiredEntityDTO.pick({ repromptID: true }).shape).strict(),
  BaseRequiredEntityCreateDTO.extend({ reprompts: z.array(AnyResponseVariantCreateDTO) }).strict(),
]);

export type RequiredEntityCreate = z.infer<typeof RequiredEntityCreateDTO>;
