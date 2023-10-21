import * as Realtime from '@voiceflow/realtime-sdk';

import { PageProgress } from '@/components/PageProgressBar/utils';
import { PageProgressBar } from '@/constants';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { waitAsync } from '@/ducks/utils';
import { getActiveDomainContext, getActivePlatformVersionContext, getActiveVersionContext } from '@/ducks/versionV2/utils';
import { Thunk } from '@/store/types';

import { allDomainIDsSelector } from './selectors';

export const create =
  ({ name, live }: { name: string; live: boolean }, { navigateToDomain }: { navigateToDomain?: boolean } = {}): Thunk<Realtime.Domain> =>
  async (dispatch, getState) => {
    const state = getState();
    const domainIDs = allDomainIDsSelector(state);
    const actionContext = getActivePlatformVersionContext(state);

    try {
      PageProgress.start(PageProgressBar.DOMAIN_CREATING);

      const domain = await dispatch(
        waitAsync(Realtime.domain.create, {
          ...actionContext,
          domain: { name: name || `Domain ${domainIDs.length}`, live },
        })
      );

      if (navigateToDomain) {
        dispatch(Router.goToDomainDiagram(domain.id, domain.rootDiagramID));
      }

      dispatch(Tracking.trackDomainCreated({ domainID: domain.id }));

      return domain;
    } finally {
      PageProgress.stop(PageProgressBar.DOMAIN_CREATING);
    }
  };

export const duplicate =
  (domainID: string, { navigateToDomain }: { navigateToDomain?: boolean } = {}): Thunk<Realtime.Domain> =>
  async (dispatch, getState) => {
    const actionContext = getActivePlatformVersionContext(getState());

    try {
      PageProgress.start(PageProgressBar.DOMAIN_CREATING);

      const domain = await dispatch(waitAsync(Realtime.domain.duplicate, { ...actionContext, domainID }));

      if (navigateToDomain) {
        dispatch(Router.goToDomainDiagram(domain.id, domain.rootDiagramID));
      }

      dispatch(Tracking.trackDomainDuplicated({ domainID: domain.id }));

      return domain;
    } finally {
      PageProgress.stop(PageProgressBar.DOMAIN_CREATING);
    }
  };

export const patch =
  (domainID: string, data: Realtime.domain.PatchPayload): Thunk =>
  async (dispatch, getState) => {
    if (data.status) {
      dispatch(Tracking.trackDomainStatusChanged({ domainID, status: data.status }));
    }

    await dispatch.sync(Realtime.domain.crud.patch({ ...getActiveVersionContext(getState()), key: domainID, value: data }));
  };

export const deleteWithANewVersion =
  (domainID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const actionContext = getActivePlatformVersionContext(state);
    const activeDomainID = Session.activeDomainIDSelector(state);

    try {
      PageProgress.start(PageProgressBar.DOMAIN_DELETING);

      if (activeDomainID === domainID) {
        dispatch(Router.goToRootDomain());
      }

      await dispatch.sync(Realtime.domain.deleteWithNewVersion({ ...actionContext, domainID }));

      dispatch(Tracking.trackDomainDeleted({ domainID }));
    } finally {
      PageProgress.stop(PageProgressBar.DOMAIN_DELETING);
    }
  };

export const currentReorderTopic =
  ({ topicID, toIndex, skipPersist }: { topicID: string; toIndex: number; skipPersist?: boolean }): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.domain.topicReorder({ ...getActiveDomainContext(getState()), topicID, toIndex }, { skipPersist }));
  };
