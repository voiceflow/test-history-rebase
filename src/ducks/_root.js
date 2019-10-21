import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import account, * as Account from '@/ducks/account';
import admin from '@/ducks/admin';
import alerts from '@/ducks/alerts';
import board from '@/ducks/board';
import creator, * as Creator from '@/ducks/creator';
import diagram, * as Diagram from '@/ducks/diagram';
import display, * as Display from '@/ducks/display';
import integrationUsers from '@/ducks/integration';
import intent, * as Intent from '@/ducks/intent';
import modal from '@/ducks/modal';
import product, * as Product from '@/ducks/product';
import project, * as Project from '@/ducks/project';
import publish from '@/ducks/publish';
import realtime, * as Realtime from '@/ducks/realtime';
import recent, * as Recent from '@/ducks/recent';
import session, * as Session from '@/ducks/session';
import skill, * as Skill from '@/ducks/skill';
import slot, * as Slot from '@/ducks/slot';
import team, * as Team from '@/ducks/team';
import test, * as Test from '@/ducks/test';
import ui, * as UI from '@/ducks/ui';
import userSetting from '@/ducks/user';
import variableSet, * as VariableSet from '@/ducks/variableSet';
import viewport, * as Viewport from '@/ducks/viewport';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    board,
    userSetting,
    modal,
    [Team.STATE_KEY]: team,
    [Account.STATE_KEY]: account,
    integrationUsers,
    admin,
    [Test.STATE_KEY]: test,
    alerts,
    publish,
    form: formReducer,

    // v2 reducers
    [Session.STATE_KEY]: session,
    [Creator.STATE_KEY]: creator,
    [Diagram.STATE_KEY]: diagram,
    [Display.STATE_KEY]: display,
    [Product.STATE_KEY]: product,
    [Project.STATE_KEY]: project,
    [VariableSet.STATE_KEY]: variableSet,
    [Skill.STATE_KEY]: skill,
    [Intent.STATE_KEY]: intent,
    [Slot.STATE_KEY]: slot,
    [Recent.STATE_KEY]: recent,
    [UI.STATE_KEY]: ui,
    [Realtime.STATE_KEY]: realtime,
    [Viewport.STATE_KEY]: viewport,
  });
