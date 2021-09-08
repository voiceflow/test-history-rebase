import { toast } from '@voiceflow/ui';

import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Feature from '@/ducks/feature';
import * as Realtime from '@/ducks/realtime';
import * as RealtimeWorkspace from '@/ducks/realtimeV2/workspace';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';

import { Middleware } from '../types';

const CREATOR_HISTORY_ACTIONS: string[] = [Creator.DiagramAction.UNDO_HISTORY, Creator.DiagramAction.REDO_HISTORY];

export const creatorHistoryMiddleware: Middleware = (store) => (next) => (action) => {
  const state = store.getState();
  const atomicActionsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
  const viewers = Realtime.activeDiagramViewersSelector(state);
  const creatorID = Account.userIDSelector(state);
  const activeDiagramID = Session.activeDiagramIDSelector(state); // do not apply creator middleware if no active diagram

  if (!activeDiagramID) {
    next(action);
    return;
  }

  const isLibraryRole =
    atomicActionsEnabled && creatorID
      ? RealtimeWorkspace.workspaceIsLibraryRoleByIDAndCreatorIDSelector(state, { id: activeDiagramID, creatorID })
      : Workspace.isLibraryRoleSelector(state);

  if (isLibraryRole) {
    next(action);
    return;
  }

  const hasViewers = viewers.length > 1;
  const isHistoryAction = CREATOR_HISTORY_ACTIONS.includes(action.type);

  const saveDiagram = () => store.dispatch(Creator.performSave(Diagram.saveActiveDiagram()));

  if (action.type === Creator.DiagramAction.SAVE_HISTORY && !action?.meta?.preventUpdate) {
    saveDiagram();

    if (hasViewers && !action?.meta?.force) {
      return;
    }
  }

  if (hasViewers && isHistoryAction) {
    toast.error('Undo and Redo actions unavailable while other active users are viewing this flow');

    return;
  }

  // eslint-disable-next-line callback-return
  next(action);

  if (isHistoryAction) {
    saveDiagram();
  }
};

export default [creatorHistoryMiddleware];
