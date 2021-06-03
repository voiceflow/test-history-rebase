import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { AnyAction, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import account, * as Account from '@/ducks/account';
import creator, * as Creator from '@/ducks/creator';
import diagram, * as Diagram from '@/ducks/diagram';
import feature, * as Feature from '@/ducks/feature';
import integrationUsers, * as IntegrationUsers from '@/ducks/integration';
import intent, * as Intent from '@/ducks/intent';
import modal, * as Modal from '@/ducks/modal';
import notifications, * as Notifications from '@/ducks/notifications';
import product, * as Product from '@/ducks/product';
import project, * as Project from '@/ducks/project';
import projectList, * as ProjectList from '@/ducks/projectList';
import prototype, * as Prototype from '@/ducks/prototype';
import realtime, * as Realtime from '@/ducks/realtime';
import recent, * as Recent from '@/ducks/recent';
import reportTag, * as ReportTag from '@/ducks/reportTag';
import * as Router from '@/ducks/router';
import session, * as Session from '@/ducks/session';
import slot, * as Slot from '@/ducks/slot';
import template, * as Template from '@/ducks/template';
import thread, * as Thread from '@/ducks/thread';
import tracking, * as Tracking from '@/ducks/tracking';
import transcript, * as Transcript from '@/ducks/transcript';
import ui, * as UI from '@/ducks/ui';
import version, * as Version from '@/ducks/version';
import viewport, * as Viewport from '@/ducks/viewport';
import workspace, * as Workspace from '@/ducks/workspace';

const getCombinedReducer = (history: History) =>
  combineReducers({
    [Router.STATE_KEY]: connectRouter(history),
    form: formReducer,
    [ProjectList.STATE_KEY]: projectList,
    [Modal.STATE_KEY]: modal,
    [Workspace.STATE_KEY]: workspace,
    [Thread.STATE_KEY]: thread,
    [Account.STATE_KEY]: account,
    [IntegrationUsers.STATE_KEY]: integrationUsers,
    [Prototype.STATE_KEY]: prototype,
    [Session.STATE_KEY]: session,
    [Creator.STATE_KEY]: creator,
    [Diagram.STATE_KEY]: diagram,
    [Product.STATE_KEY]: product,
    [Project.STATE_KEY]: project,
    [Intent.STATE_KEY]: intent,
    [Slot.STATE_KEY]: slot,
    [Recent.STATE_KEY]: recent,
    [UI.STATE_KEY]: ui,
    [Realtime.STATE_KEY]: realtime,
    [Viewport.STATE_KEY]: viewport,
    [Notifications.STATE_KEY]: notifications,
    [Tracking.STATE_KEY]: tracking,
    [Template.STATE_KEY]: template,
    [Feature.STATE_KEY]: feature,
    [Version.STATE_KEY]: version,
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

export type State = ReturnType<ReturnType<typeof getCombinedReducer>>;
