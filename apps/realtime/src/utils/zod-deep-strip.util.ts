import { z } from 'zod';

export const zodDeepStrip = <T extends z.ZodTypeAny>(schema: T): T => {
  if (schema instanceof z.ZodObject) {
    const newShape: any = {};

    Object.entries(schema.shape).forEach(([key, fieldSchema]) => {
      newShape[key] = zodDeepStrip(fieldSchema as z.ZodTypeAny);
    });

    return new z.ZodObject({ ...schema._def, shape: () => newShape }).strip() as any;
  }
  if (schema instanceof z.ZodArray) {
    return new z.ZodArray({
      ...schema._def,
      type: zodDeepStrip(schema.element),
    }) as any;
  }

  if (schema instanceof z.ZodOptional) {
    return z.ZodOptional.create(zodDeepStrip(schema.unwrap())) as any;
  }

  if (schema instanceof z.ZodNullable) {
    return z.ZodNullable.create(zodDeepStrip(schema.unwrap())) as any;
  }

  if (schema instanceof z.ZodTuple) {
    return z.ZodTuple.create(schema.items.map((item: any) => zodDeepStrip(item))) as any;
  }

  return schema;
};
