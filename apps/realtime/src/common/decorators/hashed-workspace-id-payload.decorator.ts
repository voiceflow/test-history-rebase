import { Payload } from '@voiceflow/nestjs-logux';

import { HashedWorkspaceIDPayloadPipe } from '@/common/pipes/hashed-workspace-id-payload.pipe';

export const HashedWorkspaceIDPayload = (): ParameterDecorator => Payload(HashedWorkspaceIDPayloadPipe);
