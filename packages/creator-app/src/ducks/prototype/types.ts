import { BaseButton, BaseModels, Node, Request } from '@voiceflow/base-types';
import { PlanType } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import type { PrototypeInputMode, PrototypeLayout, PrototypeStatus } from '@/constants/prototype';
import type { PrototypeContext } from '@/models';

export type PrototypeSettings = Omit<BaseModels.Version.PrototypeSettings, 'layout'> & {
  plan: PlanType;
  platform: VoiceflowConstants.PlatformType;
  projectType: VoiceflowConstants.ProjectType;
  layout: PrototypeLayout;
  locales: Realtime.AnyLocale[];
  projectName: string;
  hasPassword: boolean;
  buttons: BaseButton.ButtonsLayout;
  variableStateID?: string;
  buttonsOnly: boolean;
};

export interface ActivePath {
  blockIDs: string[];
  linkIDs: string[];
}

// context types
export interface Context extends PrototypeContext {
  activePaths?: Record<string, ActivePath>;
  targetContextDiagramID?: string;
  previousContextDiagramID?: string;
}

// redux

export interface WebhookData {
  utterance?: string;
}

export interface PrototypeState {
  ID: string | null;
  muted: boolean;
  showButtons: boolean;
  status: PrototypeStatus;
  flowIDHistory: string[];
  autoplay: boolean;
  activePaths: Record<string, ActivePath>;
  inputMode: PrototypeInputMode;
  platform?: VoiceflowConstants.PlatformType;
  projectType?: VoiceflowConstants.ProjectType;
  startTime: number;
  contextStep: number;
  contextHistory: Partial<Context>[];
  context: Context;
  visual: {
    data: Node.Visual.StepData | null;
    device: Node.Visual.DeviceType | null;
    dataHistory: (Node.Visual.StepData | null)[];
  };
  webhook: Request.BaseRequest | null;
  settings: Realtime.PrototypeSettings;
}
