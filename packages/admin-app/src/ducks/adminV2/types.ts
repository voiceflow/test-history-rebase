import { NonNullishRecord } from '@voiceflow/common';

import { Board, Creator, Error } from '@/models';

export interface AdminState {
  creator: Creator | NonNullishRecord<Record<string, unknown>>;
  boards: Board[];
  charges: any[];
  vendors: any[];
  error: Error;
}
