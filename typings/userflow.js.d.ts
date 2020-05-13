declare module 'userflow.js' {
  export type IdentifyOptions = Partial<{
    name: string;
    email: string;
    signed_up_at: string;
    [key: string]: string;
  }>;

  export function init(token: string): void;

  export function start(flowID: string): Promise<void>;

  /**
   * a warning is given about this being deprecated, but `start` doesn't seem to exist
   */
  export function startFlow(flowID: string): Promise<void>;

  export function identify(id: string, user: IdentifyOptions): Promise<void>;
}
