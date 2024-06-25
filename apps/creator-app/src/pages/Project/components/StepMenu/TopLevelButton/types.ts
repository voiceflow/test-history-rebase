import type { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';

export interface LibrarySections {
  templates: BaseModels.Version.CanvasTemplate[];
  customBlocks: Realtime.CustomBlock[];
}
