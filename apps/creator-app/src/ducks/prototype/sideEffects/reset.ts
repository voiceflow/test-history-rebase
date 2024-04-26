import { Utils } from '@voiceflow/common';
import { FeatureFlag } from '@voiceflow/realtime-sdk';

import { PrototypeStatus } from '@/constants/prototype';
import * as Domain from '@/ducks/domain/selectors';
import { isFeatureEnabledSelector } from '@/ducks/feature';
import * as Router from '@/ducks/router/sideEffects';
import * as Session from '@/ducks/session';
import * as VariableState from '@/ducks/variableState/selectors';
import type { SyncThunk } from '@/store/types';
import { findDomainIDByDiagramID } from '@/utils/domain';

import { updatePrototype, updatePrototypeStatus } from '../actions';
import { prototypeVisualSelector } from '../selectors';

export const redirectToPrototypeDiagram =
  (diagramID: string, nodeID?: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);
    if (!versionID) return;

    dispatch(Session.setActiveDiagramID(diagramID));
    dispatch(Router.goToCurrentPrototype(nodeID));

    if (!isFeatureEnabledSelector(state)(FeatureFlag.CMS_WORKFLOWS)) {
      const newDomainID = findDomainIDByDiagramID(Domain.allDomainsSelector(state), diagramID);
      if (newDomainID) dispatch(Session.setActiveDomainID(newDomainID));
    }
  };

export interface ResetOptions {
  redirect?: boolean;
}

const resetPrototype =
  ({ redirect = true }: ResetOptions = {}): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const visualState = prototypeVisualSelector(state);
    const startFrom = VariableState.selectedVariableStateSelector(state)?.startFrom;

    if (redirect && startFrom) {
      dispatch(redirectToPrototypeDiagram(startFrom.diagramID, startFrom.stepID));
    }

    dispatch(updatePrototypeStatus(PrototypeStatus.IDLE));
    dispatch(
      updatePrototype({
        sessionID: Utils.id.cuid(),
        contextStep: 0,
        contextHistory: [],
        flowIDHistory: [],
        activePaths: {},
        autoplay: false,
        visual: { ...visualState, data: null, dataHistory: [] },
      })
    );
  };

export default resetPrototype;
