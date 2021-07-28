import client from '@/client';

import { CanvasMenuLockState, EventName } from '../constants';
import { WorkspaceEventInfo } from '../types';
import { createProjectEventPayload, createProjectEventTracker, createWorkspaceEventPayload, createWorkspaceEventTracker } from '../utils';

export const trackCanvasSeeShortcutsModalOpened = createWorkspaceEventTracker(
  ({ workspaceID, projectID }: WorkspaceEventInfo & { projectID: string }) =>
    client.analytics.track(EventName.CANVAS_SHORTCUTS_MODAL_OPENED, createWorkspaceEventPayload({ workspaceID }, { project_id: projectID }))
);

export const trackCanvasMenuLock = createProjectEventTracker<{ state: CanvasMenuLockState }>((options) =>
  client.analytics.track(EventName.CANVAS_MENU_LOCK, createProjectEventPayload(options, { state: options.state }))
);

export const trackCanvasControlHelpMenuResource = createProjectEventTracker<{ resource: string }>((options) =>
  client.analytics.track(EventName.CANVAS_CONTROL_HELP_MENU, createProjectEventPayload(options, { resource: options.resource }))
);

export const trackCanvasControlInteractionModel = createProjectEventTracker((options) =>
  client.analytics.track(EventName.CANVAS_CONTROL_INTERACTION_MODEL, createProjectEventPayload(options))
);

export const trackCanvasSpotlightOpened = createProjectEventTracker((options) =>
  client.analytics.track(EventName.CANVAS_SPOTLIGHT_OPENED, createProjectEventPayload(options))
);

export const trackMarkupText = createProjectEventTracker((options) =>
  client.analytics.track(EventName.CANVAS_MARKUP_TEXT, createProjectEventPayload(options))
);

export const trackMarkupImage = createProjectEventTracker((options) =>
  client.analytics.track(EventName.CANVAS_MARKUP_IMAGE, createProjectEventPayload(options))
);

export const trackCommentingOpen = createProjectEventTracker((options) =>
  client.analytics.track(EventName.CANVAS_COMMENTING_OPENED, createProjectEventPayload(options))
);

export const trackNewThreadCreated = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_NEW_COMMENT_THREAD, createProjectEventPayload(options))
);

export const trackNewThreadReply = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_NEW_THREAD_REPLY, createProjectEventPayload(options))
);
