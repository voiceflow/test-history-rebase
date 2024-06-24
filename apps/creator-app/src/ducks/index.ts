import { connectRouter } from 'connected-react-router';
import type { History as BrowserHistory } from 'history';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import account, * as Account from '@/ducks/account';
import { billingPlanReducer } from '@/ducks/billing-plan/billing-plan.reducer';
import { STATE_KEY as BillingPlanKey } from '@/ducks/billing-plan/billing-plan.state';
import canvasTemplate, * as CanvasTemplate from '@/ducks/canvasTemplate';
import creatorV2, * as CreatorV2 from '@/ducks/creatorV2';
import customBlock, * as CustomBlock from '@/ducks/customBlock';
import diagramV2, * as DiagramV2 from '@/ducks/diagramV2';
import feature, * as Feature from '@/ducks/feature';
import history, * as History from '@/ducks/history';
import notifications, * as Notifications from '@/ducks/notifications';
import * as Organization from '@/ducks/organization';
import projectListV2, * as ProjectListV2 from '@/ducks/projectListV2';
import projectV2, * as ProjectV2 from '@/ducks/projectV2';
import prototype, * as Prototype from '@/ducks/prototype';
import recent, * as Recent from '@/ducks/recent';
import reportTag, * as ReportTag from '@/ducks/reportTag';
import * as Router from '@/ducks/router';
import session, * as Session from '@/ducks/session';
import tracking, * as Tracking from '@/ducks/tracking';
import transcript, * as Transcript from '@/ducks/transcript';
import * as UI from '@/ducks/ui';
import type { ActionReverter } from '@/ducks/utils';
import variableState, * as VariableState from '@/ducks/variableState';
import versionV2, * as VersionV2 from '@/ducks/versionV2';
import viewport, * as Viewport from '@/ducks/viewport';
import workspaceV2, * as WorkspaceV2 from '@/ducks/workspaceV2';
import type { InvalidatorLookup, ReverterLookup } from '@/store/types';

import * as Assistant from './assistant';
import * as Designer from './designer';
import stateTransducer from './transducers';

export * as Account from './account';
export * as Assistant from './assistant';
export * as CanvasTemplate from './canvasTemplate';
export * as Creator from './creatorV2';
export * as CustomBlock from './customBlock';
export * as Designer from './designer';
export * as Diagram from './diagramV2';
export * as Feature from './feature';
export * as Organization from './organization';
export * as Project from './projectV2';
export * as Prototype from './prototype';
export * as Router from './router';
export * as Session from './session';
export * as Tracking from './tracking';
export * as UI from './ui';
export * as Version from './versionV2';
export * as Viewport from './viewport';
export * as Workspace from './workspaceV2';

export interface ReducerOptions {
  browserHistory: BrowserHistory;
  reverters: ReverterLookup;
  invalidators: InvalidatorLookup;
  getClientNodeID: () => string;
}

const getCombinedReducer = (browserHistory: BrowserHistory) =>
  combineReducers({
    form: formReducer,
    [Account.STATE_KEY]: account,
    [Assistant.STATE_KEY]: Assistant.reducer,
    [BillingPlanKey]: billingPlanReducer,
    [CanvasTemplate.STATE_KEY]: canvasTemplate,
    [CreatorV2.STATE_KEY]: creatorV2,
    [CustomBlock.STATE_KEY]: customBlock,
    [Designer.STATE_KEY]: Designer.reducer,
    [DiagramV2.STATE_KEY]: diagramV2,
    [Feature.STATE_KEY]: feature,
    [History.STATE_KEY]: history,
    [Notifications.STATE_KEY]: notifications,
    [Organization.STATE_KEY]: Organization.reducer,
    [ProjectListV2.STATE_KEY]: projectListV2,
    [ProjectV2.STATE_KEY]: projectV2,
    [Prototype.STATE_KEY]: prototype,
    [Recent.STATE_KEY]: recent,
    [ReportTag.STATE_KEY]: reportTag,
    [Router.STATE_KEY]: connectRouter(browserHistory),
    [Session.STATE_KEY]: session,
    [Tracking.STATE_KEY]: tracking,
    [Transcript.STATE_KEY]: transcript,
    [UI.STATE_KEY]: UI.reducer,
    [VariableState.STATE_KEY]: variableState,
    [VersionV2.STATE_KEY]: versionV2,
    [Viewport.STATE_KEY]: viewport,
    [WorkspaceV2.STATE_KEY]: workspaceV2,
  });

const createReducer = ({ browserHistory, reverters, invalidators, getClientNodeID }: ReducerOptions) =>
  stateTransducer(reverters, invalidators, getClientNodeID)(getCombinedReducer(browserHistory));

export default createReducer;

export const allRPCs = [...WorkspaceV2.rpcs, ...VersionV2.rpcs, ...Session.rpcs, ...ProjectV2.rpcs];

export const allReverters: ActionReverter<any>[] = [...CreatorV2.reverters];

export type State = ReturnType<ReturnType<typeof getCombinedReducer>>;

declare module 'react-redux' {
  export interface DefaultRootState extends State {}
}
