import '@voiceflow/socket-utils';

import type { Mock } from 'vitest';

declare module '@voiceflow/socket-utils' {
  interface AbstractLoguxControl {
    $reply: Mock;
    $reject: Mock;
  }
}
