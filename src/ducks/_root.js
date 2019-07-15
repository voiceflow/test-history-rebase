import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import account from '@/ducks/account';
import admin from '@/ducks/admin';
import alerts from '@/ducks/alerts';
import board from '@/ducks/board';
import diagrams from '@/ducks/diagram';
import diagramVariables from '@/ducks/diagram_variable';
import displays from '@/ducks/display';
import integrationUsers from '@/ducks/integration';
import modal from '@/ducks/modal';
import products from '@/ducks/product';
import project from '@/ducks/project';
import team from '@/ducks/team';
import test from '@/ducks/test';
import userSetting from '@/ducks/user';
import variables from '@/ducks/variable';
import skills from '@/ducks/version';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    skills,
    products,
    displays,
    board,
    diagrams,
    variables,
    userSetting,
    diagramVariables,
    project,
    modal,
    team,
    account,
    integrationUsers,
    admin,
    test,
    alerts,
  });
