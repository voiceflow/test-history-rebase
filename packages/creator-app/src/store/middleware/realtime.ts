import { createStructuredSelector } from 'reselect';

import { NEW_PRODUCT_ID } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import { CRUDAction } from '@/ducks/utils/crud';
import * as Version from '@/ducks/version';

import { createRealtimeResourceUpdateMiddleware } from './utils';

const realtimeMiddleware = [
  createRealtimeResourceUpdateMiddleware(
    Realtime.ResourceType.SETTINGS,
    createStructuredSelector({
      settings: Version.activeSettingsSelector,
      publishing: Version.activePublishingSelector,
      session: Version.activeSessionSelector,
      name: Project.activeProjectNameSelector,
    }),
    { ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_VERSION_ID, Session.SessionAction.SET_ACTIVE_PROJECT_ID] }
  ),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.FLOWS, Diagram.allDiagramsSelector, { ignore: [CRUDAction.CRUD_REPLACE] }),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.PRODUCTS, Product.allProductsSelector, {
    ignore: [
      CRUDAction.CRUD_REPLACE,
      CRUDAction.CRUD_UPDATE,
      (action) => action.type === CRUDAction.CRUD_ADD && action.payload?.key === NEW_PRODUCT_ID,
      (action) => action.type === CRUDAction.CRUD_REMOVE && action.payload === NEW_PRODUCT_ID,
    ],
  }),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.INTENTS, Intent.allIntentsSelector, { ignore: [CRUDAction.CRUD_REPLACE] }),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.SLOTS, Slot.allSlotsSelector, { ignore: [CRUDAction.CRUD_REPLACE] }),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.VARIABLES, Version.activeGlobalVariablesSelector, {
    ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_VERSION_ID],
  }),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.DIAGRAM, Diagram.activeDiagramSelector, {
    ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_DIAGRAM_ID],
  }),
];

export default realtimeMiddleware;
