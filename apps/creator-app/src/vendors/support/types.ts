import { AnyRecord } from '@voiceflow/common';

interface SupportChat {
  initialized: boolean;
  initChat: VoidFunction;
}

interface AJAXOptions {
  function: string;
  settings: AnyRecord;

  settings_extra?: AnyRecord;
}

interface SupportUserClass {
  new (user: unknown): unknown;
}

type AuthResponse = [unknown, string];

interface SupportAPI {
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
