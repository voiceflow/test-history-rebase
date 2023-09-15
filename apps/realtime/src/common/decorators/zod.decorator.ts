import type { PipeTransform, Type } from '@nestjs/common';
import { Body, Query } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import type { z } from 'nestjs-zod/z';

export const ZodQuery = (name: string, schema: z.ZodTypeAny, ...pipes: Array<Type<PipeTransform> | PipeTransform>) =>
  Query(name, new ZodValidationPipe(schema), ...pipes);

export const ZodBody = (schema: z.ZodTypeAny, ...pipes: Array<Type<PipeTransform> | PipeTransform>) => Body(new ZodValidationPipe(schema), ...pipes);
