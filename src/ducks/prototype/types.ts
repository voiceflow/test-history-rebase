import { DeviceType, GeneralRequest } from '@voiceflow/general-types';
import { StepData } from '@voiceflow/general-types/build/nodes/visual';

import { PrototypeContext } from '@/models';

// context types
export interface Context extends PrototypeContext {
  previousContextDiagramID?: string;
  targetContextDiagramID?: string;
  activePathBlockIDs?: string[];
  activePathLinkIDs?: string[];
}

// redux
export enum PrototypeStatus {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export enum InputMode {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
}

export enum PrototypeMode {
  CANVAS = 'Canvas',
  DISPLAY = 'Display',
  DEVELOPER = 'Developer',
  SETTINGS = 'Settings',
}

export type WebhookData = {
  utterance?: string;
};

export interface PrototypeState {
  ID: string | null;
  muted: boolean;
  showChips: boolean;
  status: PrototypeStatus;
  flowIDHistory: string[];
  autoplay: boolean;
  activePathBlockIDs: string[];
  activePathLinkIDs: string[];
  inputMode: InputMode;
  startTime: number;
  contextStep: number;
  contextHistory: Partial<Context>[];
  context: Context;
  /**
   * map of project IDs to prototype nodes, so that each project can persist a different active mode
   */
  mode: Record<string, PrototypeMode>;
  visual: {
    data: StepData | null;
    device: DeviceType | null;
  };
  webhook: GeneralRequest;
}
