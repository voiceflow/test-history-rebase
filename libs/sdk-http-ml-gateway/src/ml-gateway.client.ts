import { BaseClient, NestedClient } from '@voiceflow/sdk-common';

import { GenerationClient, NluManagerClient, PrivateCompletionClient } from './generated';

export class MLGatewayClient extends BaseClient('https://ml-gateway.voiceflow.com')({
  /** @deprecated not scoped in as part of V3 yet */
  nluManager: NluManagerClient,
  generation: GenerationClient,
  private: NestedClient({
    completion: PrivateCompletionClient,
  }),
}) {}
