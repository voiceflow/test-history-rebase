import { VersionPrototype } from '@voiceflow/api-sdk';
import { BaseRequest, ButtonsLayout, DeviceType } from '@voiceflow/general-types';
import { StepData } from '@voiceflow/general-types/build/nodes/visual';

import { PlanType, PlatformType } from '@/constants';
import { AnyLocale } from '@/ducks/version';
import { PrototypeContext } from '@/models';

export type PrototypeSettings = Omit<VersionPrototype['settings'], 'layout'> & {
  plan: PlanType;
  platform: PlatformType;
  layout: PrototypeLayout;
  locales: AnyLocale[];
  projectName: string;
  hasPassword: boolean;
  buttons: ButtonsLayout;
};

// context types
export interface Context extends PrototypeContext {
  activePathLinkIDs?: string[];
  activePathBlockIDs?: string[];
  targetContextDiagramID?: string;
  previousContextDiagramID?: string;
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
  VARIABLES = 'Variables',
  SETTINGS = 'Settings',
}

export type WebhookData = {
  utterance?: string;
};

export enum PrototypeLayout {
  TEXT_DIALOG = 'text-and-dialog',
  VOICE_DIALOG = 'voice-and-dialog',
  VOICE_VISUALS = 'voice-and-visuals',
}

export type PrototypeShareViewSettings = {
  layout?: PrototypeLayout;
  brandColor?: string;
  brandImage?: string;
  avatar?: string;
  password?: string;
  buttons?: string;
};

export interface PrototypeState {
  ID: string | null;
  muted: boolean;
  showButtons: boolean;
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
    dataHistory: (StepData | null)[];
  };
  webhook: BaseRequest | null;
  settings: PrototypeShareViewSettings;
}
