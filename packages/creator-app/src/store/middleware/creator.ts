import { toast } from '@/components/Toast';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Realtime from '@/ducks/realtime';
import * as Workspace from '@/ducks/workspace';

import { StoreMiddleware } from '../types';

const CREATOR_HISTORY_ACTIONS: string[] = [Creator.DiagramAction.UNDO_HISTORY, Creator.DiagramAction.REDO_HISTORY];

export const creatorHistoryMiddleware: StoreMiddleware = (store) => (next) => (action) => {
  const state = store.getState();
  const viewers = Realtime.activeDiagramViewersSelector(state);
  const isLibraryRole = Workspace.isLibraryRoleSelector(state);
  const hasViewers = viewers.length > 1;
  const isHistoryAction = CREATOR_HISTORY_ACTIONS.includes(action.type);

  if (isLibraryRole) {
    next(action);
    return;
  }

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
