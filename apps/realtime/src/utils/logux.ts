import { Utils } from '@voiceflow/common';

export type ErrorCode<T> = T extends Utils.protocol.AsyncError<infer R> ? R : never;

export class AsyncActionError<T extends Utils.protocol.AsyncError<number>> extends Error {
  code: ErrorCode<T> | null = null;

  constructor(data: T) {
    super(data.message);

    if (data.code != null) {
      this.code = data.code as ErrorCode<T>;
    }
  }
}
