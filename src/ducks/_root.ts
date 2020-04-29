import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import account, * as Account from '@/ducks/account';
import creator, * as Creator from '@/ducks/creator';
import diagram, * as Diagram from '@/ducks/diagram';
import display, * as Display from '@/ducks/display';
import feature, * as Feature from '@/ducks/feature';
import integrationUsers, * as IntegrationUsers from '@/ducks/integration';
import intent, * as Intent from '@/ducks/intent';
import list from '@/ducks/lists';
import modal, * as Modal from '@/ducks/modal';
import notifications, * as Notifications from '@/ducks/notifications';
import product, * as Product from '@/ducks/product';
import project, * as Project from '@/ducks/project';
import prototype, * as Prototype from '@/ducks/prototype';
import publish from '@/ducks/publish';
import realtime, * as Realtime from '@/ducks/realtime';
import recent, * as Recent from '@/ducks/recent';
import * as Router from '@/ducks/router';
import session, * as Session from '@/ducks/session';
import skill, * as Skill from '@/ducks/skill';
import slot, * as Slot from '@/ducks/slot';
import template, * as Template from '@/ducks/template';
import tracking, * as Tracking from '@/ducks/tracking';
import ui, * as UI from '@/ducks/ui';
import userSetting, * as UsertSetting from '@/ducks/user';
import variableSet, * as VariableSet from '@/ducks/variableSet';
import viewport, * as Viewport from '@/ducks/viewport';
import workspace, * as Workspace from '@/ducks/workspace';

const createReducer = (history: History) =>
  combineReducers({
    [Router.STATE_KEY]: connectRouter(history),
    form: formReducer,
    list,
    publish,
    [UsertSetting.STATE_KEY]: userSetting,
    [Modal.STATE_KEY]: modal,
    [Workspace.STATE_KEY]: workspace,
    [Account.STATE_KEY]: account,
    [IntegrationUsers.STATE_KEY]: integrationUsers,
    [Prototype.STATE_KEY]: prototype,
    [Session.STATE_KEY]: session,
    [Creator.STATE_KEY]: creator,
    [Diagram.STATE_KEY]: diagram,
    [Display.STATE_KEY]: display,
    [Product.STATE_KEY]: product,
    [Project.STATE_KEY]: project,
    [VariableSet.STATE_KEY]: variableSet,
    [Skill.STATE_KEY]: skill as any,
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
  });

export default createReducer;

export type State = ReturnType<ReturnType<typeof createReducer>>;
