import type { PlanType, UserRole } from '@voiceflow/internal';

interface ChatWidgetLoadOptions {
  verify: { projectID: string };
  versionID?: string;
  userID?: string;
  user?: {
    name: string;
    image?: string;
  };
}

interface ChatWidget {
  hide: VoidFunction;
  show: VoidFunction;
  load: (options: ChatWidgetLoadOptions) => void;
  destroy: VoidFunction;
}

export interface ChatWidgetEventData {
  type: string;
}

interface VoiceflowWidget {
  chat: ChatWidget;
}

declare global {
  interface Window {
    voiceflow?: VoiceflowWidget;
    VFAForceSetup?: VoidFunction;
    VFAProduction?: VoidFunction;
    VFADevelopment?: VoidFunction;
    VFAToggleDevLogs?: VoidFunction;
  }
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  image?: string;
}

export interface Project {
  id: string;
  nlu: string;
  name: string;
  type: string;
  locales: string[];
  platform: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: PlanType | null;
}
