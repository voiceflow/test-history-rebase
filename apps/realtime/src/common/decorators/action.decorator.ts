import { applyDecorators } from '@nestjs/common';
import { Action as LoguxAction, Broadcast, BroadcastCallback } from '@voiceflow/nestjs-logux';
import { Permission, ResourceResolver } from '@voiceflow/sdk-auth';
import { Authorize } from '@voiceflow/sdk-auth/nestjs';
import { Channels } from '@voiceflow/sdk-logux-designer';
import { DesignerAction } from '@voiceflow/sdk-logux-designer/build/types';
import type { ActionCreator, AsyncActionCreators } from 'typescript-fsa';

import { BroadcastOnly } from './broadcast-only.decorator';
import { UseRequestContext } from './request-context.decorator';

interface IAction<T> {
  action: ActionCreator<T> | AsyncActionCreators<T, any, any>;
  broadcast?: BroadcastCallback<T>;
  permissions?: [permissions: Permission | Permission[], getResource: ResourceResolver<T>];
  broadcastOnly?: boolean;
  requestContext?: boolean;
}

const isAsyncAction = <T>(
  action: ActionCreator<T> | AsyncActionCreators<T, any, any>
): action is AsyncActionCreators<T, any, any> => 'started' in action;

export function Action<T extends Record<string, any>>({
  action,
  broadcast,
  permissions,
  broadcastOnly,
  requestContext = true,
}: IAction<T>) {
  const decorators: MethodDecorator[] = [isAsyncAction(action) ? LoguxAction.Async(action) : LoguxAction(action)];

  if (broadcast) {
    decorators.push(Broadcast(broadcast));
  }

  if (permissions) {
    const [permission, getResource] = permissions;

    decorators.push(Authorize.Permissions<T>(Array.isArray(permission) ? permission : [permission], getResource));
  }

  if (broadcastOnly) {
    decorators.push(BroadcastOnly() as MethodDecorator);
  }

  if (requestContext) {
    decorators.push(UseRequestContext());
  }

  return applyDecorators(...decorators);
}

Action.Permissions = {
  AssistantUpdate: [Permission.PROJECT_UPDATE, ({ context }) => ({ id: context.environmentID, kind: 'version' })],
} satisfies Record<string, [permissions: Permission | Permission[], getResource: ResourceResolver<DesignerAction>]>;

Action.Broadcast = {
  Assistant: ({ context }: DesignerAction) => ({ channel: Channels.assistant.build(context) }),
} as const;

Action.Assistant = {
  Update: <T extends DesignerAction>(
    action: ActionCreator<T> | AsyncActionCreators<T, any, any>,
    config?: Pick<IAction<T>, 'requestContext'>
  ) =>
    Action<T>({
      ...config,
      action,
      broadcast: isAsyncAction(action) ? undefined : Action.Broadcast.Assistant,
      permissions: Action.Permissions.AssistantUpdate,
      broadcastOnly: !isAsyncAction(action),
    }),
} as const;
