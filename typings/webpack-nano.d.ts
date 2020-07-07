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

    // logging
    logFilter: string;
    logLevel: string;

    // vendors
    ga: boolean;
    intercom: boolean;
    logrocket: boolean;
    tracking: boolean;
    userflow: boolean;

    // feature flags
    ff_bulkUpload: boolean;
    ff_canvasExport: boolean;
    ff_commenting: boolean;
    ff_gadgets: boolean;
    ff_markup: boolean;
    ff_promptEditor: boolean;
    ff_repromptEditor: boolean;
    ff_templates: boolean;
  }>;

  export = argv;
}
