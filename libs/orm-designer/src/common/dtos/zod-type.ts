import { JsonType } from '@mikro-orm/core';
import type { z } from 'zod';

export class ZodType<Type extends z.ZodTypeAny> extends JsonType {
  constructor(private readonly schema: Type) {
    super();
  }

  convertToJSValue(value: unknown): Type {
    return this.schema.parse(value);
  }

  convertToDatabaseValue(value: unknown): string {
    return JSON.stringify(this.schema.parse(value));
  }
}
