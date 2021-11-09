import { Utils } from '@voiceflow/common';

import { Reducer } from '@/store/types';

import { AddLink } from '../actions';
import { linkFactory } from '../factories';
import { DiagramState } from '../types';
import { addLinkToState, getLinkIDsByPortID, removeAllLinksFromState } from '../utils';

const addLinkReducer: Reducer<DiagramState, AddLink> = (state, { payload: { sourcePortID, targetPortID, linkID } }) => {
  const sourcePort = Utils.normalized.getNormalizedByKey(state.ports, sourcePortID);
  const targetPort = Utils.normalized.getNormalizedByKey(state.ports, targetPortID);
  const existingLinkIDs = getLinkIDsByPortID(state)(sourcePortID);

  const link = linkFactory(sourcePort, targetPort, linkID);

  return Utils.functional.compose(removeAllLinksFromState(existingLinkIDs), addLinkToState(link))(state);
};

export default addLinkReducer;
