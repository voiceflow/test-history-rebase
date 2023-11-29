import { Utils } from '@voiceflow/common';

export const ErrorCode = {} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export type MLError = Utils.protocol.AsyncError<ErrorCode>;
