import { z } from 'zod';

import { AnyConditionCreateDTO } from '@/condition/condition-create.dto';

import { ResponseMessageDTO } from './response-message.dto';

const BaseResponseMessageCreateDTO = z.object({
  condition: z.nullable(AnyConditionCreateDTO),
});

export const ResponseMessageCreateDTO = BaseResponseMessageCreateDTO.extend(
  ResponseMessageDTO.pick({ text: true, condition: true, delay: true }).shape
);

export type ResponseMessageCreate = z.infer<typeof ResponseMessageCreateDTO>;
