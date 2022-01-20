import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { AnyAction, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import account, * as Account from '@/ducks/account';
import creator, * as Creator from '@/ducks/creator';
import diagram, * as Diagram from '@/ducks/diagram';
import diagramV2, * as DiagramV2 from '@/ducks/diagramV2';
import feature, * as Feature from '@/ducks/feature';
import integrationUsers, * as IntegrationUsers from '@/ducks/integration';
import intent, * as Intent from '@/ducks/intent';
import intentV2, * as IntentV2 from '@/ducks/intentV2';
import modal, * as Modal from '@/ducks/modal';
import notifications, * as Notifications from '@/ducks/notifications';
import product, * as Product from '@/ducks/product';
import productV2, * as ProductV2 from '@/ducks/productV2';
import project, * as Project from '@/ducks/project';
import projectList, * as ProjectList from '@/ducks/projectList';
import projectListV2, * as ProjectListV2 from '@/ducks/projectListV2';
import projectV2, * as ProjectV2 from '@/ducks/projectV2';
import prototype, * as Prototype from '@/ducks/prototype';
import realtime, * as Realtime from '@/ducks/realtime';
import recent, * as Recent from '@/ducks/recent';
import reportTag, * as ReportTag from '@/ducks/reportTag';
import * as Router from '@/ducks/router';
import session, * as Session from '@/ducks/session';
import slot, * as Slot from '@/ducks/slot';
import slotV2, * as SlotV2 from '@/ducks/slotV2';
import template, * as Template from '@/ducks/template';
import thread, * as Thread from '@/ducks/thread';
import tracking, * as Tracking from '@/ducks/tracking';
import transcript, * as Transcript from '@/ducks/transcript';
import ui, * as UI from '@/ducks/ui';
import variableState, * as VariableState from '@/ducks/variableState';
import version, * as Version from '@/ducks/version';
import versionV2, * as VersionV2 from '@/ducks/versionV2';
import viewport, * as Viewport from '@/ducks/viewport';
import workspace, * as Workspace from '@/ducks/workspace';
import workspaceV2, * as WorkspaceV2 from '@/ducks/workspaceV2';

const getCombinedReducer = (history: History) =>
  combineReducers({
    [Router.STATE_KEY]: connectRouter(history),
    form: formReducer,
    [ProjectList.STATE_KEY]: projectList,
    [ProjectListV2.STATE_KEY]: projectListV2,
    [Modal.STATE_KEY]: modal,
    [Workspace.STATE_KEY]: workspace,
    [WorkspaceV2.STATE_KEY]: workspaceV2,
    [Thread.STATE_KEY]: thread,
    [Account.STATE_KEY]: account,
    [IntegrationUsers.STATE_KEY]: integrationUsers,
    [Prototype.STATE_KEY]: prototype,
    [Session.STATE_KEY]: session,
    [Creator.STATE_KEY]: creator,
    [Diagram.STATE_KEY]: diagram,
    [DiagramV2.STATE_KEY]: diagramV2,
    [Product.STATE_KEY]: product,
    [ProductV2.STATE_KEY]: productV2,
    [Project.STATE_KEY]: project,
    [ProjectV2.STATE_KEY]: projectV2,
    [Intent.STATE_KEY]: intent,
    [IntentV2.STATE_KEY]: intentV2,
    [Slot.STATE_KEY]: slot,
    [SlotV2.STATE_KEY]: slotV2,
    [Recent.STATE_KEY]: recent,
    [UI.STATE_KEY]: ui,
    [Realtime.STATE_KEY]: realtime,
    [Viewport.STATE_KEY]: viewport,
    [Notifications.STATE_KEY]: notifications,
    [Tracking.STATE_KEY]: tracking,
    [VariableState.STATE_KEY]: variableState,
    [Template.STATE_KEY]: template,
    [Feature.STATE_KEY]: feature,
    [Version.STATE_KEY]: version,
    [VersionV2.STATE_KEY]: versionV2,
    [ReportTag.STATE_KEY]: reportTag,
    [Transcript.STATE_KEY]: transcript,
  });

const createReducer = (history: History) => {
  const rootReducer = getCombinedReducer(history);

  return (state: State | undefined, action: AnyAction) => {
    let nextState: Partial<State | undefined> = state;

    if (action.type === Account.AccountAction.RESET_ACCOUNT) {
      nextState = {
        viewport: nextState?.viewport,
        ui: nextState?.ui,
        recent: nextState?.recent,
      };
    }

    return rootReducer(nextState as State | undefined, action);
  };
};

export default createReducer;

export const allRPCs = [...Workspace.rpcs, ...Version.rpcs, ...Session.rpcs];

export type State = ReturnType<ReturnType<typeof getCombinedReducer>>;

declare module 'react-redux' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultRootState extends State {}
}
