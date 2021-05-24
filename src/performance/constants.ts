export enum RunnerEvent {
  PERF_ACTION = 'perf-action',
}

export enum PerfScenario {
  EDITOR_RENDERED_ON_BLOCK_CLICK = 'EDITOR_RENDERED_ON_BLOCK_CLICK',
}

export enum PerfAction {
  BLOCK_CLICK = 'BLOCK_CLICK',
  LOGIN_RENDERED = 'LOGIN_RENDERED',
  EDITOR_RENDERED = 'EDITOR_RENDERED',
  CANVAS_RENDERED = 'CANVAS_RENDERED',
  DASHBOARD_RENDERED = 'DASHBOARD_RENDERED',
}

export const SCENARIOS_ACTIONS_MAP = {
  [PerfScenario.EDITOR_RENDERED_ON_BLOCK_CLICK]: [PerfAction.BLOCK_CLICK, PerfAction.EDITOR_RENDERED],
} as const;

export const MOCK_DATA = {
  LOGIN: {
    email: 'zzz@zzz.zz',
    password: 'zzz@zzz.zz',
  },

  VERSIONS: [
    {
      id: '60911a5d1cca130006146ab0',
      name: 'small',
      nodeIDs: ['609553af901df6b4d80ea3c9', '60911a7b96c0904132f42e4a', '6095539a901df6b4d80ea3c1'],
    },
  ],
};
