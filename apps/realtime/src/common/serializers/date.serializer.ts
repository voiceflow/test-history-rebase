import { Injectable } from '@nestjs/common';

import type { BaseSerializer } from './base.serializer';

type SerializedDates<T extends Record<string, any>> = {
  [K in keyof T]: Date extends T[K] ? (null extends T[K] ? string | null : string) : T[K];
};

@Injectable()
export class DateSerializer implements BaseSerializer<Record<string, any>, Record<string, any>> {
  serialize<T extends Record<string, any>>(data: T): SerializedDates<T> {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value instanceof Date ? value.toJSON() : value])
    ) as SerializedDates<T>;
  }

  nullable<T extends Record<string, any>>(data: T): SerializedDates<T>;

  nullable<T extends Record<string, any>>(data: T | null): SerializedDates<T> | null;

  nullable<T extends Record<string, any>>(data: T | null): SerializedDates<T> | null {
    return !data ? null : this.serialize(data);
  }

  iterable = <T extends Record<string, any>>(data: T[]): SerializedDates<T>[] =>
    data.map((item) => this.nullable(item));
}
