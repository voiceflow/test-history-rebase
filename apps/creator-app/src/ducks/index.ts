import { connectRouter } from 'connected-react-router';
import { History as BrowserHistory } from 'history';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import account, * as Account from '@/ducks/account';
import canvasTemplate, * as CanvasTemplate from '@/ducks/canvasTemplate';
import creatorV2, * as CreatorV2 from '@/ducks/creatorV2';
import customBlock, * as CustomBlock from '@/ducks/customBlock';
import diagramV2, * as DiagramV2 from '@/ducks/diagramV2';
import domain, * as Domain from '@/ducks/domain';
import feature, * as Feature from '@/ducks/feature';
import history, * as History from '@/ducks/history';
import intentV2, * as IntentV2 from '@/ducks/intentV2';
import nlu, * as NLU from '@/ducks/nlu';
import note, * as Note from '@/ducks/note';
import notifications, * as Notifications from '@/ducks/notifications';
import organizations, * as Organizations from '@/ducks/organization';
import projectListV2, * as ProjectListV2 from '@/ducks/projectListV2';
import projectV2, * as ProjectV2 from '@/ducks/projectV2';
import prototype, * as Prototype from '@/ducks/prototype';
import recent, * as Recent from '@/ducks/recent';
import reportTag, * as ReportTag from '@/ducks/reportTag';
import * as Router from '@/ducks/router';
import session, * as Session from '@/ducks/session';
import slotV2, * as SlotV2 from '@/ducks/slotV2';
import threadV2, * as ThreadV2 from '@/ducks/threadV2';
import tracking, * as Tracking from '@/ducks/tracking';
import transcript, * as Transcript from '@/ducks/transcript';
import ui, * as UI from '@/ducks/ui';
import { ActionReverter } from '@/ducks/utils';
import variableState, * as VariableState from '@/ducks/variableState';
import versionV2, * as VersionV2 from '@/ducks/versionV2';
import viewport, * as Viewport from '@/ducks/viewport';
import workspaceV2, * as WorkspaceV2 from '@/ducks/workspaceV2';
import { InvalidatorLookup, ReverterLookup } from '@/store/types';

import * as Designer from './designer';
import stateTransducer from './transducers';

export * as Designer from './designer';
export * as Feature from './feature';
export * as Intent from './intentV2';
export * as Project from './projectV2';
export * as Session from './session';
export * as Slot from './slotV2';
export * as Version from './versionV2';
export * as Workspace from './workspaceV2';

export interface ReducerOptions {
  browserHistory: BrowserHistory;
  reverters: ReverterLookup;
  invalidators: InvalidatorLookup;
  getClientNodeID: () => string;
}

const getCombinedReducer = (browserHistory: BrowserHistory) =>
  combineReducers({
    [Router.STATE_KEY]: connectRouter(browserHistory),
    form: formReducer,
    [ProjectListV2.STATE_KEY]: projectListV2,
    [WorkspaceV2.STATE_KEY]: workspaceV2,
    [ThreadV2.STATE_KEY]: threadV2,
    [Account.STATE_KEY]: account,
    [Prototype.STATE_KEY]: prototype,
    [Session.STATE_KEY]: session,
    [CreatorV2.STATE_KEY]: creatorV2,
    [DiagramV2.STATE_KEY]: diagramV2,
    [ProjectV2.STATE_KEY]: projectV2,
    [IntentV2.STATE_KEY]: intentV2,
    [SlotV2.STATE_KEY]: slotV2,
    [Recent.STATE_KEY]: recent,
    [UI.STATE_KEY]: ui,
    [Viewport.STATE_KEY]: viewport,
    [Notifications.STATE_KEY]: notifications,
    [Tracking.STATE_KEY]: tracking,
    [VariableState.STATE_KEY]: variableState,
    [Feature.STATE_KEY]: feature,
    [VersionV2.STATE_KEY]: versionV2,
    [ReportTag.STATE_KEY]: reportTag,
    [Transcript.STATE_KEY]: transcript,
    [Note.STATE_KEY]: note,
    [History.STATE_KEY]: history,
    [Domain.STATE_KEY]: domain,
    [CanvasTemplate.STATE_KEY]: canvasTemplate,
    [CustomBlock.STATE_KEY]: customBlock,
    [NLU.STATE_KEY]: nlu,
    [Organizations.STATE_KEY]: organizations,
    [Designer.STATE_KEY]: Designer.reducer,
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
