import { BaseModels } from '@voiceflow/base-types';

export interface NLUImportModel {
  slots: BaseModels.Slot[];
  intents: BaseModels.Intent[];
}
