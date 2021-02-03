declare module 'webpack-nano/argv' {
  const argv: Partial<{
    prod: boolean;
    env: string;
    action: 'build' | 'serve' | 'admin' | 'admin-serve';

    host: string;
    port: number;
    open: boolean;

    instrument: boolean;

    // debugging
    debug: boolean;
    debugHttp: boolean;
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
    tracking: boolean;
    userflow: boolean;

    // configuration
    privateCloud: boolean;

    // feature flags
    ff_gadgets: boolean;
    ff_codeExport: boolean;
    ff_visualPrototype: boolean;
    ff_visualStep: boolean;
    ff_wavenetVoices: boolean;
  }>;

  export = argv;
}
