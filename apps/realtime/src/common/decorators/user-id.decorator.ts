import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { LoguxContext } from '@voiceflow/nestjs-logux';

export const UserID = createParamDecorator((_data: never, ctx: ExecutionContext) => {
  LoguxContext.assertLoguxTransport(ctx);

  return Number(LoguxContext.fromArguments(ctx).getContext().userId);
});
