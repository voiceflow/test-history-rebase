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

    // feature flags
    ff_commenting: boolean;
    ff_gadgets: boolean;
    ff_workspaceCreationFlow: boolean;
    ff_inviteByLink: boolean;
    ff_templates: boolean;
    ff_dataRefactor: boolean;
    ff_projectSplitting: boolean;
  }>;

  export = argv;
}
