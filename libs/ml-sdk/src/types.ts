import { Utils } from '@voiceflow/common';

export enum ErrorCode {}

export type MLError = Utils.protocol.AsyncError<ErrorCode>;
