import { createStructuredSelector } from 'reselect';

import { NEW_PRODUCT_ID } from '@/constants';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProductV2 from '@/ducks/productV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as SlotV2 from '@/ducks/slotV2';
import { CRUDAction } from '@/ducks/utils/crud';
import * as VersionV2 from '@/ducks/versionV2';

import { createRealtimeResourceUpdateMiddleware } from './utils';

const realtimeMiddleware = [
  createRealtimeResourceUpdateMiddleware(
    Realtime.ResourceType.SETTINGS,
    createStructuredSelector({
      settings: VersionV2.active.settingsSelector,
      publishing: VersionV2.active.publishingSelector,
      session: VersionV2.active.sessionSelector,
      name: ProjectV2.active.nameSelector,
    }),
    { ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_VERSION_ID, Session.SessionAction.SET_ACTIVE_PROJECT_ID] }
  ),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.FLOWS, DiagramV2.allDiagramsSelector, { ignore: [CRUDAction.CRUD_REPLACE] }),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.PRODUCTS, ProductV2.allProductsSelector, {
    ignore: [
      CRUDAction.CRUD_REPLACE,
      CRUDAction.CRUD_UPDATE,
      (action) => action.type === CRUDAction.CRUD_ADD && action.payload?.key === NEW_PRODUCT_ID,
      (action) => action.type === CRUDAction.CRUD_REMOVE && action.payload === NEW_PRODUCT_ID,
    ],
  }),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.INTENTS, IntentV2.allIntentsSelector, { ignore: [CRUDAction.CRUD_REPLACE] }),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.SLOTS, SlotV2.allSlotsSelector, { ignore: [CRUDAction.CRUD_REPLACE] }),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.VARIABLES, VersionV2.active.globalVariablesSelector, {
    ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_VERSION_ID],
  }),
  createRealtimeResourceUpdateMiddleware(Realtime.ResourceType.DIAGRAM, DiagramV2.active.diagramSelector, {
    ignore: [CRUDAction.CRUD_REPLACE, Session.SessionAction.SET_ACTIVE_DIAGRAM_ID],
  }),
];

export default realtimeMiddleware;
