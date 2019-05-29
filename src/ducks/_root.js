import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";
import skills from "ducks/version";
import diagramVariables from "ducks/diagram_variable";
import variables from "ducks/variable";
import diagrams from "ducks/diagram";
import products from "ducks/product";
import displays from "ducks/display";
import emails from "ducks/email";
import userSetting from "ducks/user";
import project from "ducks/project";
import modal from "ducks/modal";
import team from "ducks/team";
import account from "ducks/account";
import board from "ducks/board"
import integrationUsers from "ducks/integration";
import admin from 'ducks/admin';

export default history =>
  combineReducers({
    router: connectRouter(history),
    skills,
    products,
    displays,
    emails,
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
    admin
  });
