import { compose } from '@/utils/functional';
import { getNormalizedByKey } from '@/utils/normalized';

import { linkFactory } from './factories';
import { addLinkToState, getLinkIDsByPortID, removeAllLinksFromState } from './utils';

const addLinkReducer = (state, { payload: { sourcePortID, targetPortID, linkID } }) => {
  const sourcePort = getNormalizedByKey(state.ports, sourcePortID);
  const targetPort = getNormalizedByKey(state.ports, targetPortID);
  const existingLinkIDs = getLinkIDsByPortID(state)(sourcePortID);

  const link = linkFactory(sourcePort, targetPort, linkID);

  return compose(removeAllLinksFromState(existingLinkIDs), addLinkToState(link))(state);
};

export default addLinkReducer;
