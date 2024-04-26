import { LoguxError } from '@logux/core';

const serializeStandardError = (error: Error) => ({
  name: error.name,
  message: error.message,
  stack: error.stack,
});

const serializeLoguxError = (error: LoguxError) => ({
  ...serializeStandardError(error),
  type: error.type,
  description: error.description,
  options: error.options,
});

export const serializeError = (error: Error) =>
  error instanceof LoguxError ? serializeLoguxError(error) : serializeStandardError(error);
