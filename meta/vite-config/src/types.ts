export type Env = Record<string, string | undefined>;

export interface Options {
  /**
   * name of the project
   */
  name: string;

  /**
   * alias for the root directory
   * @default ''
   * @example rootAlias: 'ui' -> '@ui'
   */
  rootAlias?: string;

  sourcemap?: boolean;

  experimentalSWC?: boolean;

  env?: Env | (() => Env);

  aliases?: Record<string, string> | ((options: { isServe: boolean }) => Record<string, string>);

  /**
   * an absolute path to the root directory of the project
   * @default process.cwd()
   */
  rootDir?: string;

  serve?: {
    /**
     * port to serve the dev server
     */
    port?: number;

    /**
     * provide HTTPS configuration to enable SSL
     */
    https?: {
      /**
       * path to the HTTPS key, relative to `rootDir`
       */
      key: string;
      /**
       * path to the HTTPS certificate, relative to `rootDir`
       */
      cert: string;
    };
  };
}

export interface ExtendingOptions {
  isE2E: boolean;
  isTest: boolean;
  isServe: boolean;
}
