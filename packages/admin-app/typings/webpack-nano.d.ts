declare module 'webpack-nano/argv' {
  const argv: Partial<{
    prod: boolean;
    env: string;
    action: 'build' | 'serve' | 'admin' | 'admin-serve';

    host: string;
    port: number;
    open: boolean;

    instrument: boolean;
    validate: boolean;
    analyze: boolean;
    typecheck: boolean;
    strict: boolean;

    // debugging
    debug: boolean;
    debugFetch: boolean;
    debugNet: boolean;
    debugRealtime: boolean;
    debugSocket: boolean;
    debugCanvas: boolean;
    canvasCrosshair: boolean;

    // logging
    logFilter: string;
    logLevel: string;

    // vendors
    ga: boolean;
    intercom: boolean;
    logrocket: boolean;
    userflow: boolean;
    sentry: boolean;
    growsurf: boolean;

    // configuration
    privateCloud: boolean;
  }>;

  export = argv;
}
