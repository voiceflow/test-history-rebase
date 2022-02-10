import { BaseButton, BaseModels, Node, Request } from '@voiceflow/base-types';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import type { PrototypeContext } from '@/models';

export type PrototypeSettings = Omit<BaseModels.Version.PrototypeSettings, 'layout'> & {
  plan: PlanType;
  platform: VoiceflowConstants.PlatformType;
  layout: PrototypeLayout;
  locales: Realtime.AnyLocale[];
  projectName: string;
  hasPassword: boolean;
  buttons: BaseButton.ButtonsLayout;
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

export interface WebhookData {
  utterance?: string;
}

export enum PrototypeLayout {
  TEXT_DIALOG = 'text-and-dialog',
  VOICE_DIALOG = 'voice-and-dialog',
  VOICE_VISUALS = 'voice-and-visuals',
}

export interface PrototypeShareViewSettings {
  layout?: PrototypeLayout;
  brandColor?: string;
  brandImage?: string;
  avatar?: string;
  password?: string;
  buttons?: string;
}

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
  platform?: VoiceflowConstants.PlatformType;
  startTime: number;
  contextStep: number;
  contextHistory: Partial<Context>[];
  context: Context;
  /**
   * map of project IDs to prototype nodes, so that each project can persist a different active mode
   */
  mode: Record<string, PrototypeMode>;
  visual: {
    data: Node.Visual.StepData | null;
    device: Node.Visual.DeviceType | null;
    dataHistory: (Node.Visual.StepData | null)[];
  };
  webhook: Request.BaseRequest | null;
  settings: PrototypeShareViewSettings;
}
