import { BaseModels } from '@voiceflow/base-types';

export enum PrototypeLayout {
  TEXT_DIALOG = 'text-and-dialog',
  VOICE_DIALOG = 'voice-and-dialog',
  VOICE_VISUALS = 'voice-and-visuals',
}

export interface PrototypeSettings extends BaseModels.Version.PrototypeSettings {
  layout?: PrototypeLayout;
}
