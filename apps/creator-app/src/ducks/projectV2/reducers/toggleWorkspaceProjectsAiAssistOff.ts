import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const toggleWorkspaceProjectsAiAssistOff = createReducer(Realtime.project.toggleWorkspaceProjectsAiAssistOff, (state, { workspaceID }) => {
  state.allKeys.forEach((key) => {
    const project = Normal.getOne(state, key);

    if (!project || project.workspaceID !== workspaceID) return;

    Normal.patchOne(state, project.id, { aiAssistSettings: { generateNoMatch: false } });
  });
});

export default toggleWorkspaceProjectsAiAssistOff;
