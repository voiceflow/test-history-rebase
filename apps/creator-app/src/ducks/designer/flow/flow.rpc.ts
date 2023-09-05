import { Actions } from '@voiceflow/sdk-logux-designer';

import { setActiveDiagramID, setActiveFlowID } from '@/ducks/session/actions';
import { createRPC } from '@/ducks/utils';

export const activate = createRPC(Actions.Flow.Activate, ({ flowID, diagramID }) => (dispatch) => {
  dispatch(setActiveFlowID(flowID));
  dispatch(setActiveDiagramID(diagramID));
});
