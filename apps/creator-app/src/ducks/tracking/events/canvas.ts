import client from '@/client';
import type { BlockType, StepMenuType } from '@/constants';

import type { CanvasCreationType, NoMatchCreationType, VariableType } from '../constants';
import { EventName } from '../constants';
import { createProjectEvent, createProjectEventTracker, createVersionEvent, createVersionEventTracker } from '../utils';

export const trackCanvasSeeShortcutsModalOpened = createProjectEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.CANVAS_SHORTCUTS_MODAL_OPENED, eventInfo))
);

export const trackBackupManuallyCreated = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.BACKUP_MANUALLY_CREATED, eventInfo))
);

export const trackCanvasControlHelpMenuResource = createVersionEventTracker<{ resource: string }>((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.CANVAS_CONTROL_HELP_MENU, eventInfo))
);

export const trackCanvasControlInteractionModel = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.CANVAS_CONTROL_INTERACTION_MODEL, eventInfo))
);

export const trackCanvasSpotlightOpened = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.CANVAS_SPOTLIGHT_OPENED, eventInfo))
);

export const trackMarkupText = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.CANVAS_MARKUP_TEXT, eventInfo))
);

export const trackMarkupImage = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.CANVAS_MARKUP_IMAGE, eventInfo))
);

export const trackCommentingOpen = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.CANVAS_COMMENTING_OPENED, eventInfo))
);

export const trackNewThreadCreated = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_NEW_COMMENT_THREAD, eventInfo))
);

export const trackNewThreadReply = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_NEW_THREAD_REPLY, eventInfo))
);

export const trackVariableCreated = createProjectEventTracker<{
  diagramID?: string;
  variableType: VariableType;
  creationType: CanvasCreationType;
}>(({ diagramID, variableType, creationType, ...eventInfo }) =>
  client.analytics.track(
    createProjectEvent(EventName.VARIABLE_CREATED, {
      ...eventInfo,
      diagram_id: diagramID,
      variable_type: variableType,
      creation_type: creationType,
    })
  )
);

export const trackNewStepCreated = createProjectEventTracker<{
  stepType: BlockType;
  menuType: StepMenuType;
}>(({ stepType, menuType, ...eventInfo }) =>
  client.analytics.track(
    createProjectEvent(EventName.PROJECT_NEW_STEP_CREATED, { ...eventInfo, step_type: stepType, menu_type: menuType })
  )
);

export const trackSearchBarQuery = createProjectEventTracker<{ query: string }>(({ query, ...eventInfo }) =>
  client.analytics.track(createProjectEvent(EventName.SEARCH_BAR_QUERY, { ...eventInfo, query }))
);

export const trackSearchBarResultSelected = createProjectEventTracker<{
  query: string;
  selected: string;
  resultListSize: number;
}>(({ query, selected, resultListSize, ...eventInfo }) =>
  client.analytics.track(
    createProjectEvent(EventName.SEARCH_BAR_RESULT_SELECTED, {
      ...eventInfo,
      query,
      selected,
      result_list_size: resultListSize,
    })
  )
);

export const trackActionAdded = createProjectEventTracker<{ nodeType: BlockType; actionType: BlockType }>(
  ({ nodeType, actionType, ...eventInfo }) =>
    client.analytics.track(
      createProjectEvent(EventName.ACTION_ADDED, { ...eventInfo, step_type: nodeType, action_type: actionType })
    )
);

export const trackActionDeleted = createProjectEventTracker<{ nodeType: BlockType; actionType: BlockType }>(
  ({ nodeType, actionType, ...eventInfo }) =>
    client.analytics.track(
      createProjectEvent(EventName.ACTION_DELETED, { ...eventInfo, step_type: nodeType, action_type: actionType })
    )
);

export const trackBlockTemplateCreated = createProjectEventTracker<{
  templateID: string;
  nestedSteps: BlockType[];
}>(({ templateID, nestedSteps, ...eventInfo }) =>
  client.analytics.track(
    createProjectEvent(EventName.BLOCK_TEMPLATE_CREATED, {
      ...eventInfo,
      template_id: templateID,
      nested_steps: nestedSteps,
    })
  )
);

export const trackBlockTemplateUsed = createProjectEventTracker<{
  templateID: string;
  nestedSteps: BlockType[];
  droppedInto: 'canvas' | 'block';
}>(({ templateID, nestedSteps, droppedInto, ...eventInfo }) =>
  client.analytics.track(
    createProjectEvent(EventName.BLOCK_TEMPLATE_USED, {
      ...eventInfo,
      template_id: templateID,
      nested_steps: nestedSteps,
      dropped_into: droppedInto,
    })
  )
);

export const trackNoMatchCreated = createProjectEventTracker<{
  stepID?: string;
  stepType?: BlockType;
  creationType: NoMatchCreationType;
}>(({ stepID, stepType, creationType, ...eventInfo }) =>
  client.analytics.track(
    createProjectEvent(EventName.NO_MATCH_CREATED, {
      ...eventInfo,
      step_id: stepID,
      step_type: stepType,
      creation_type: creationType,
    })
  )
);

export const trackNoReplyCreated = createProjectEventTracker<{
  stepID?: string;
  stepType?: BlockType;
  creationType: NoMatchCreationType;
}>(({ stepID, stepType, creationType, ...eventInfo }) =>
  client.analytics.track(
    createProjectEvent(EventName.NO_REPLY_CREATED, {
      ...eventInfo,
      step_id: stepID,
      step_type: stepType,
      creation_type: creationType,
    })
  )
);
