import type * as Platform from '@voiceflow/platform-config';

import client from '@/client';
import type * as NLP from '@/config/nlp';
import type { NLUImportOrigin } from '@/constants';

import type { CanvasCreationType } from '../constants';
import { EventName } from '../constants';
import {
  createProjectEvent,
  createProjectEventTracker,
  createWorkspaceEvent,
  createWorkspaceEventTracker,
} from '../utils';

export const trackProjectNLUImportFromWorkspace = createWorkspaceEventTracker<{
  origin: NLUImportOrigin;
  projectID: string;
  importNLPType: NLP.Constants.NLPType;
  targetNLUType: Platform.Constants.NLUType;
}>(({ projectID, importNLPType, targetNLUType, ...eventInfo }) =>
  client.analytics.track(
    createWorkspaceEvent(EventName.PROJECT_NLU_IMPORT, {
      ...eventInfo,
      nlu_type: targetNLUType,
      project_id: projectID,
      nlp_provider: importNLPType,
    })
  )
);

export const trackIntentCreatedProjectNLUImport = createWorkspaceEventTracker<{
  projectID: string;
  creationType: CanvasCreationType;
}>(({ projectID, creationType, ...eventInfo }) =>
  client.analytics.track(
    createWorkspaceEvent(EventName.INTENT_CREATED, { ...eventInfo, project_id: projectID, creation_type: creationType })
  )
);

export const trackEntityCreatedProjectNLUImport = createWorkspaceEventTracker<{
  projectID: string;
  creationType: CanvasCreationType;
}>(({ projectID, creationType, ...eventInfo }) =>
  client.analytics.track(
    createWorkspaceEvent(EventName.ENTITY_CREATED, { ...eventInfo, project_id: projectID, creation_type: creationType })
  )
);

export const trackNewUtteranceCreatedProjectNLUImport = createWorkspaceEventTracker<{
  projectID: string;
  creationType: CanvasCreationType;
}>(({ projectID, creationType, ...eventInfo }) =>
  client.analytics.track(
    createWorkspaceEvent(EventName.PROJECT_NEW_UTTERANCE_CREATED, {
      ...eventInfo,
      project_id: projectID,
      creation_type: creationType,
    })
  )
);

export const trackProjectNLUImportFailed = createProjectEventTracker<{
  origin: NLUImportOrigin;
  importNLPType: NLP.Constants.NLPType;
  targetNLUType: Platform.Constants.NLUType;
}>(({ importNLPType, targetNLUType, ...eventInfo }) =>
  client.analytics.track(
    createProjectEvent(EventName.PROJECT_NLU_IMPORT_FAILED, {
      ...eventInfo,
      nlu_type: targetNLUType,
      nlp_provider: importNLPType,
    })
  )
);
