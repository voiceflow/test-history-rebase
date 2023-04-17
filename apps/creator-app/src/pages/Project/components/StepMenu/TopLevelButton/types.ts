import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

export interface LibrarySections {
  templates: BaseModels.Version.CanvasTemplate[];
  customBlocks: Realtime.CustomBlock[];
}
