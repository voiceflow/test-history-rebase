import { toast } from '@voiceflow/ui';

import { Permission } from '@/config/permissions';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';

import { Middleware } from '../types';

const CREATOR_HISTORY_ACTIONS: string[] = [Creator.DiagramAction.UNDO_HISTORY, Creator.DiagramAction.REDO_HISTORY];

export const creatorHistoryMiddleware: Middleware = (store) => (next) => (action) => {
  const state = store.getState();
  const viewers = Realtime.activeDiagramViewersSelector(state);
  const activeDiagramID = Session.activeDiagramIDSelector(state); // do not apply creator middleware if no active diagram
  const canEditCanvas = WorkspaceV2.active.hasPermissionSelector(state, Permission.EDIT_CANVAS);

  if (!activeDiagramID || !canEditCanvas) {
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
