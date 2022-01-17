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

    // configuration
    privateCloud: boolean;

    // feature flags
    /* eslint-disable camelcase */
    ff_trace: boolean;
    ff_gadgets: boolean;
    ff_natoApco: boolean;
    ff_captureV2: boolean;
    ff_ownerRole: boolean;
    ff_asrBypass: boolean;
    ff_dialogflow: boolean;
    ff_motorolaSSO: boolean;
    ff_testReports: boolean;
    ff_googleCreate: boolean;
    ff_atomicActions: boolean;
    ff_wavenetVoices: boolean;
    ff_topicsAndComponents: boolean;
    ff_account_page_redesign: boolean;
    ff_variable_states: boolean;
    ff_realtime_connection: boolean;
    /* eslint-enable camelcase */
  }>;

  export = argv;
}
