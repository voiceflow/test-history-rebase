import '@voiceflow/socket-utils';

import { Mock } from 'vitest';

declare module '@voiceflow/socket-utils' {
  interface AbstractLoguxControl {
    $reply: Mock;
    $reject: Mock;
  }
}
