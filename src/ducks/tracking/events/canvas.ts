import client from '@/client';

import { CanvasControlHelpMenuResource, CanvasMenuLockState, EventName } from '../constants';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackCanvasMenuLock = createProjectEventTracker<{ state: CanvasMenuLockState }>((options) =>
  client.analytics.track(EventName.CANVAS_MENU_LOCK, createProjectEventPayload(options, { state: options.state }))
);

export const trackCanvasControlHelpMenuResource = createProjectEventTracker<{ resource: CanvasControlHelpMenuResource }>((options) =>
  client.analytics.track(EventName.CANVAS_CONTROL_HELP_MENU, createProjectEventPayload(options, { resource: options.resource }))
);

export const trackCanvasControlInteractionModel = createProjectEventTracker((options) =>
  client.analytics.track(EventName.CANVAS_CONTROL_INTERACTION_MODEL, createProjectEventPayload(options))
);

export const trackCanvasSpotlightOpened = createProjectEventTracker((options) =>
  client.analytics.track(EventName.CANVAS_SPOTLIGHT_OPENED, createProjectEventPayload(options))
);

export const trackMarkupOpen = ({ skillID, projectID, workspaceID }: { skillID: string; projectID: string; workspaceID: string }) => () =>
  client.analytics.track(EventName.CANVAS_MARKUP_OPENED, {
    teamhashed: ['workspace_id'],
    properties: {
      skill_id: skillID,
      workspace_id: workspaceID,
      project_id: projectID,
    },
  });

export const trackMarkupSessionDuration = (duration: number) => () =>
  client.analytics.track(EventName.CANVAS_MARKUP_DURATION, { properties: { duration: Math.floor(duration / 1000) } });
