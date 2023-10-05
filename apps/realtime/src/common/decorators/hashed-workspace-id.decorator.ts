import { HashedWorkspaceIDPipe } from '@voiceflow/nestjs-common';
import { Param } from '@voiceflow/nestjs-logux';

export const HashedWorkspaceID = (property: string): ParameterDecorator => Param(property, HashedWorkspaceIDPipe);
