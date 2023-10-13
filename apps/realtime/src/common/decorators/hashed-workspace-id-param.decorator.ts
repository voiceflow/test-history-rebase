import { HashedWorkspaceIDPipe } from '@voiceflow/nestjs-common';
import { Param } from '@voiceflow/nestjs-logux';

export const HashedWorkspaceIDParam = (property: string): ParameterDecorator => Param(property, HashedWorkspaceIDPipe);
