import { z } from 'zod';

import { Channel, Language } from '@/common';

import { CompiledResponseMessageDTO } from './response-message/compiled/response-message.compiled.dto';

/**
 * Replace this ad-hoc template string literal type when Zod finally supports the feature:
 * https://github.com/colinhacks/zod/pull/1786
 */
export type CompiledDiscriminatorKey = `${Channel}:${Language}`;

export const CompiledDiscriminatorKeyDTO = z.custom<CompiledDiscriminatorKey>((val) => {
  if (typeof val !== 'string') return false;
  if (!/^\d+:[\d-]+$/.test(val)) return false;

  const colonIndex = val.indexOf(':');
  const channel = val.slice(0, colonIndex);
  const language = val.slice(colonIndex + 1);
  return Object.values<string>(Channel).includes(channel) && Object.values<string>(Language).includes(language);
});

export const CompiledMessageDTO = z.object({
  variants: z.record(CompiledDiscriminatorKeyDTO, z.array(CompiledResponseMessageDTO)),
});

export type CompiledMessage = z.infer<typeof CompiledMessageDTO>;
