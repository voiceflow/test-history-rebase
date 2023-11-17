import { Global } from '@nestjs/common';
import { ClientModule } from '@voiceflow/sdk-common/nestjs';

import { DesignerClient } from '@/designer.client';

@Global()
export class DesignerModule extends ClientModule(DesignerClient) {}
