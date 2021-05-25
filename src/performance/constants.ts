export enum RunnerEvent {
  PERF_ACTION = 'perf-action',
}

export enum PerfScenario {
  EDITOR_RENDERED_ON_STEP_CLICK = 'EDITOR_RENDERED_ON_STEP_CLICK',
  FLOW_RENDERED_ON_FLOW_LINK_CLICK = 'FLOW_RENDERED_ON_FLOW_LINK_CLICK',
}

export enum PerfAction {
  NODE_CLICK = 'NODE_CLICK',
  LOGIN_RENDERED = 'LOGIN_RENDERED',
  EDITOR_RENDERED = 'EDITOR_RENDERED',
  CANVAS_RENDERED = 'CANVAS_RENDERED',
  DASHBOARD_RENDERED = 'DASHBOARD_RENDERED',
  FLOW_NODE__LINK_CLICK = 'FLOW_NODE__LINK_CLICK',
}

export const SCENARIOS_ACTIONS_MAP = {
  [PerfScenario.EDITOR_RENDERED_ON_STEP_CLICK]: [PerfAction.NODE_CLICK, PerfAction.EDITOR_RENDERED],
  [PerfScenario.FLOW_RENDERED_ON_FLOW_LINK_CLICK]: [PerfAction.FLOW_NODE__LINK_CLICK, PerfAction.CANVAS_RENDERED],
} as const;

export const MOCK_DATA = {
  LOGIN: {
    email: 'zzz@zzz.zz',
    password: 'zzz@zzz.zz',
  },

  VERSIONS: [
    {
      id: '60abab3edd6e8f00066f2c3c',
      name: 'small',
      stepIDs: ['60abab65a266c8a0ca25a065', '60ababaea266c8a0ca25a06f', '60abac32a266c8a0ca25a07e'],
      flowStepID: '60abacb8a266c8a0ca25a08a',
    },
  ],
};
