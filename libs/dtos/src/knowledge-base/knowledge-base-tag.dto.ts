import { z } from 'zod';

import type { Enum } from '@/utils/type/enum.util';

export const KBTagDTO = z.object({
  tagID: z.string(),
  label: z.string(),
});

export type KBTag = z.infer<typeof KBTagDTO>;

export const KBTagRecordDTO = z.record(z.string(), KBTagDTO);

export type KBTagRecord = z.infer<typeof KBTagRecordDTO>;

export const KBBooleanOperatorsDTO = {
  AND: 'and',
  OR: 'or',
};

export type KBBooleanOperators = Enum<typeof KBBooleanOperatorsDTO>;

export const KBTagsFilterWithOperatorDTO = z.object({
  items: z.array(z.string()),
  operator: z.nativeEnum(KBBooleanOperatorsDTO).optional(),
});

export type KBTagsFilterWithOperator = z.infer<typeof KBTagsFilterWithOperatorDTO>;

export const KBTagsFilterDTO = z.object({
  include: KBTagsFilterWithOperatorDTO.optional(),
  exclude: KBTagsFilterWithOperatorDTO.optional(),
  includeAllTagged: z.boolean().optional(),
  includeAllNonTagged: z.boolean().optional(),
});

export type KBTagsFilter = z.infer<typeof KBTagsFilterDTO>;
