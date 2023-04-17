import { AnyRecord } from '@voiceflow/common';

export interface SupportChat {
  initialized: boolean;
  initChat: VoidFunction;
}

export interface AJAXOptions {
  function: string;
  settings: AnyRecord;
  // eslint-disable-next-line camelcase
  settings_extra?: AnyRecord;
}

export interface SupportUserClass {
  new (user: unknown): unknown;
}

export type AuthResponse = [unknown, string];

export interface SupportAPI {
  getActiveUser: (flag: boolean, callback: () => Promise<void>) => void;
  activeUser: (user?: unknown) => unknown;
  ajax: (options: AJAXOptions, callback: (response: AuthResponse) => void) => void;
  errorValidation: (response: AuthResponse) => boolean;
  loginCookie: (token: string) => void;
  login: (email: string, password: string, unknown1: string, unknown2: string, callback: VoidFunction) => void;
}

declare global {
  interface Window {
    SBChat?: SupportChat;
    SBF?: SupportAPI;
    SBUser?: SupportUserClass;
    asyncSBChatReady?: () => Promise<void>;
  }
}
