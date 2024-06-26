import * as Account from '@/ducks/account';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Feature from '@/ducks/feature';
import * as History from '@/ducks/history';
import * as Notifications from '@/ducks/notifications';
import * as Organization from '@/ducks/organization';
import * as ProjectListV2 from '@/ducks/projectListV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import * as ReportTag from '@/ducks/reportTag';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import * as Transcript from '@/ducks/transcript';
import * as UI from '@/ducks/ui';
import { createCRUDState } from '@/ducks/utils/crudV2';
import * as VariableState from '@/ducks/variableState';
import * as VersionV2 from '@/ducks/versionV2';
import * as Viewport from '@/ducks/viewport';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import type { State } from '@/store/types';

export const MOCK_STATE: State = {
  form: {},

  [Account.STATE_KEY]: Account.INITIAL_STATE,
  [CreatorV2.STATE_KEY]: CreatorV2.INITIAL_STATE,
  [DiagramV2.STATE_KEY]: DiagramV2.INITIAL_STATE,
  [Feature.STATE_KEY]: Feature.INITIAL_STATE,
  [Notifications.STATE_KEY]: Notifications.INITIAL_STATE,
  [ProjectV2.STATE_KEY]: { ...createCRUDState(), awareness: { viewers: {} } },
  [ProjectListV2.STATE_KEY]: createCRUDState(),
  [Prototype.STATE_KEY]: Prototype.INITIAL_STATE as ReturnType<typeof Prototype.default>,
  [Recent.STATE_KEY]: Recent.INITIAL_STATE as ReturnType<typeof Recent.default>,
  [ReportTag.STATE_KEY]: createCRUDState(),
  [Router.STATE_KEY]: {
    location: Object.assign(new URL('http://foo.bar'), { query: {}, state: {} }),
    action: 'REPLACE',
  },
  [Session.STATE_KEY]: {
    ...Session.INITIAL_STATE,
    token: { value: null },
    tabID: '',
    browserID: '',
    anonymousID: '',
    activeProjectID: null,
    activeVersionID: null,
    activeWorkspaceID: null,
  },
  [Tracking.STATE_KEY]: {},
  [Transcript.STATE_KEY]: Transcript.INITIAL_STATE,
  [UI.STATE_KEY]: UI.INITIAL_STATE as ReturnType<typeof UI.default>,
  [VersionV2.STATE_KEY]: createCRUDState(),
  [Viewport.STATE_KEY]: Viewport.INITIAL_STATE as ReturnType<typeof Viewport.default>,
  [WorkspaceV2.STATE_KEY]: createCRUDState(),
  [VariableState.STATE_KEY]: { ...VariableState.INITIAL_STATE, selectedState: null },
  [History.STATE_KEY]: History.INITIAL_STATE,
  [Organization.STATE_KEY]: Organization.INITIAL_STATE,
};
