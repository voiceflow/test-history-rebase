import { BaseButton, BaseModels, Node, Request } from '@voiceflow/base-types';
import { PlanType } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import type { PrototypeInputMode, PrototypeLayout, PrototypeStatus } from '@/constants/prototype';
import type { PrototypeContext } from '@/models';

export type PrototypeSettings = Omit<BaseModels.Version.PrototypeSettings, 'layout'> & {
  plan: PlanType;
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  layout: PrototypeLayout;
  locales: string[];
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
  sessionID: string;
  muted: boolean;
  showButtons: boolean;
  status: PrototypeStatus;
  flowIDHistory: string[];
  autoplay: boolean;
  activePaths: Record<string, ActivePath>;
  inputMode: PrototypeInputMode;
  platform?: Platform.Constants.PlatformType;
  projectType?: Platform.Constants.ProjectType;
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
