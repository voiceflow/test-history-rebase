import { Global } from '@nestjs/common';
import { ClientModule } from '@voiceflow/sdk-common/nestjs';

import { MLGatewayClient } from '@/ml-gateway.client';

@Global()
export class MLGatewayModule extends ClientModule(MLGatewayClient) {}
