import { getNormalizedByKey } from '@/utils/normalized';

import { linkFactory } from './factories';
import { addLinkToState } from './utils';

const addLinkReducer = (state, { payload: { sourcePortID, targetPortID, linkID } }) => {
  const sourcePort = getNormalizedByKey(state.ports, sourcePortID);
  const targetPort = getNormalizedByKey(state.ports, targetPortID);

  const link = linkFactory(sourcePort, targetPort, linkID);

  return addLinkToState(link)(state);
};

export default addLinkReducer;
