import client from '@/client';
import { BlockType, InteractionModelTabType, StepMenuType } from '@/constants';
import { SearchTypes } from '@/contexts/SearchContext';

import { CanvasCreationType, CanvasMenuLockState, EventName, IntentEditType, VariableType } from '../constants';
import { createProjectEventPayload, createProjectEventTracker, createVersionEventPayload, createVersionEventTracker } from '../utils';

export const trackCanvasSeeShortcutsModalOpened = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_SHORTCUTS_MODAL_OPENED, createProjectEventPayload(options))
);

export const trackEntityCreated = createProjectEventTracker<{ creationType: CanvasCreationType }>((options) =>
  client.api.analytics.track(EventName.ENTITY_CREATED, createProjectEventPayload(options, { creation_type: options.creationType }))
);

export const trackVersionManuallyCreated = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.VERSION_MANUALLY_CREATED, createVersionEventPayload(options))
);

export const trackCanvasMenuLock = createProjectEventTracker<{ state: CanvasMenuLockState }>((options) =>
  client.api.analytics.track(EventName.CANVAS_MENU_LOCK, createProjectEventPayload(options, { state: options.state }))
);

export const trackCanvasControlHelpMenuResource = createVersionEventTracker<{ resource: string }>((options) =>
  client.api.analytics.track(EventName.CANVAS_CONTROL_HELP_MENU, createVersionEventPayload(options, { resource: options.resource }))
);

export const trackCanvasControlInteractionModel = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_CONTROL_INTERACTION_MODEL, createVersionEventPayload(options))
);

export const trackCanvasSpotlightOpened = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_SPOTLIGHT_OPENED, createVersionEventPayload(options))
);

export const trackMarkupText = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_MARKUP_TEXT, createVersionEventPayload(options))
);

export const trackMarkupImage = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_MARKUP_IMAGE, createVersionEventPayload(options))
);

export const trackCommentingOpen = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.CANVAS_COMMENTING_OPENED, createVersionEventPayload(options))
);

export const trackNewThreadCreated = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_NEW_COMMENT_THREAD, createVersionEventPayload(options))
);

export const trackNewThreadReply = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_NEW_THREAD_REPLY, createVersionEventPayload(options))
);

export const trackIMMNavigation = createProjectEventTracker<{ tabName: InteractionModelTabType }>((options) =>
  client.api.analytics.track(EventName.IMM_NAVIGATION, createProjectEventPayload(options, { tab_name: options.tabName }))
);

export const trackIntentEdit = createProjectEventTracker<{ creationType: IntentEditType }>((options) =>
  client.api.analytics.track(EventName.INTENTS_EDIT, createProjectEventPayload(options, { creation_type: options.creationType }))
);

export const trackIntentCreated = createProjectEventTracker<{ creationType: CanvasCreationType }>((options) =>
  client.api.analytics.track(EventName.INTENT_CREATED, createProjectEventPayload(options, { creation_type: options.creationType }))
);

export const trackEntityEdit = createProjectEventTracker<{ creationType: CanvasCreationType }>((options) =>
  client.api.analytics.track(EventName.ENTITIES_EDIT, createProjectEventPayload(options, { creation_type: options.creationType }))
);

export const trackVariableCreated = createProjectEventTracker<{ diagramID?: string; variableType: VariableType; creationType: CanvasCreationType }>(
  (options) =>
    client.api.analytics.track(
      EventName.VARIABLE_CREATED,
      createProjectEventPayload(options, { diagram_id: options.diagramID, variable_type: options.variableType, creation_type: options.creationType })
    )
);

export const trackNewUtteranceCreated = createProjectEventTracker<{
  intentID: string;
  creationType: CanvasCreationType;
}>(({ intentID, creationType, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_NEW_UTTERANCE_CREATED,
    createProjectEventPayload(options, { intent_id: intentID, creation_type: creationType })
  )
);

export const trackUtteranceBulkImport = createProjectEventTracker<{
  intentID: string;
  creationType: CanvasCreationType;
}>(({ intentID, creationType, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_UTTERANCE_BULK_IMPORT,
    createProjectEventPayload(options, { intent_id: intentID, creation_type: creationType })
  )
);

export const trackNewStepCreated = createProjectEventTracker<{
  stepType: BlockType;
  menuType: StepMenuType;
}>(({ stepType, menuType, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_NEW_STEP_CREATED,
    createProjectEventPayload(options, {
      step_type: stepType,
      menu_type: menuType,
    })
  )
);

export const trackSearchBarQuery = createProjectEventTracker<{
  query: string;
  creator_id: number | null;
  workspace_id: string | null;
  project_id: string;
}>(({ query, creator_id, workspace_id, project_id, ...options }) =>
  client.api.analytics.track(
    EventName.SEARCH_BAR_QUERY,
    createProjectEventPayload(options, {
      query,
      creator_id,
      workspace_id,
      project_id,
    })
  )
);

export const trackSearchBarResultSelected = createProjectEventTracker<{
  creator_id: number | null;
  workspace_id: string | null;
  project_id: string;
  query: string;
  resultList: {
    label: React.ReactNode;
    entry: SearchTypes.DatabaseEntry;
  }[];
  selected: string;
}>(({ creator_id, workspace_id, project_id, query, resultList, selected, ...options }) =>
  client.api.analytics.track(
    EventName.SEARCH_BAR_RESULT_SELECTED,
    createProjectEventPayload(options, {
      creator_id,
      workspace_id,
      project_id,
      query,
      result_list: resultList,
      selected,
    })
  )
);

export const trackActionAdded = createProjectEventTracker<{ nodeType: BlockType; actionType: BlockType }>((options) =>
  client.api.analytics.track(
    EventName.ACTION_ADDED,
    createProjectEventPayload(options, { step_type: options.nodeType, action_type: options.actionType })
  )
);

export const trackActionDeleted = createProjectEventTracker<{ nodeType: BlockType; actionType: BlockType }>((options) =>
  client.api.analytics.track(
    EventName.ACTION_DELETED,
    createProjectEventPayload(options, { step_type: options.nodeType, action_type: options.actionType })
  )
);

export const trackBlockTemplateCreated = createProjectEventTracker<{
  creator_id: number | null;
  workspace_id: string | null;
  project_id: string;
  org_id: string | null;
  template_id: string | null;
  nested_steps: (BlockType | undefined)[];
}>(({ creator_id, workspace_id, project_id, org_id, template_id, nested_steps, ...options }) =>
  client.api.analytics.track(
    EventName.BLOCK_TEMPLATE_CREATED,
    createProjectEventPayload(options, {
      creator_id,
      workspace_id,
      project_id,
      org_id,
      template_id,
      nested_steps,
    })
  )
);

export const trackBlockTemplateUsed = createProjectEventTracker<{
  creator_id: number | null;
  workspace_id: string | null;
  project_id: string;
  org_id: string | null;
  template_id: string | null;
  nested_steps: (BlockType | undefined)[];
  dropped_into: 'canvas' | 'block';
}>(({ creator_id, workspace_id, project_id, org_id, template_id, nested_steps, dropped_into, ...options }) =>
  client.api.analytics.track(
    EventName.BLOCK_TEMPLATE_USED,
    createProjectEventPayload(options, {
      creator_id,
      workspace_id,
      project_id,
      org_id,
      template_id,
      nested_steps,
      dropped_into,
    })
  )
);
