import { BaseVersion } from '@voiceflow/base-types';
import { toast } from '@voiceflow/ui';
import ObjectID from 'bson-objectid';
import React from 'react';

import client from '@/client';

// TODO: Need to move this to general types
export interface ProjectVersion {
  name?: string;
  created: string;
  versionID: string;
  creatorID: number;
  manualSave: boolean;
  autoSaveFromRestore: boolean;
}

const DEFAULT_FETCH_LIMIT = 10;

export type Version = Omit<BaseVersion.Version, 'nluUnclassifiedData'>;

export const versionAdapter = (version: Version) => ({
  name: version.name,
  created: ObjectID.isValid(version._id) ? new ObjectID(version._id).getTimestamp().toString() : '',
  creatorID: version.creatorID,
  versionID: version._id,
  manualSave: version.manualSave,
  autoSaveFromRestore: version.autoSaveFromRestore,
});

export const useProjectVersions = (projectID: string) => {
  const [versionList, setVersionList] = React.useState<ProjectVersion[]>([]);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [noMoreVersions, setNoMoreVersions] = React.useState(false);
  const [initialFetching, setInitialFetching] = React.useState(true);

  const fetchVersions = async (offset: number) => {
    try {
      const nextVersions = await client.api.project.getVersionsV2<BaseVersion.PlatformData>(projectID, { offset, limit: DEFAULT_FETCH_LIMIT });

      setVersionList((prevList) => [...prevList, ...nextVersions.map((version) => versionAdapter(version))]);

      if (!nextVersions || nextVersions.length < DEFAULT_FETCH_LIMIT) {
        setNoMoreVersions(true);
      }
    } catch (err) {
      toast.error('Error fetching versions');
    }
  };

  const onLoadMore = async () => {
    if (noMoreVersions || loadingMore) return;

    setLoadingMore(true);

    await fetchVersions(versionList.length);

    setLoadingMore(false);
  };

  const fetchInitialVersions = async () => {
    await fetchVersions(0);

    setInitialFetching(false);
  };

  const resetState = () => {
    setVersionList([]);
    setNoMoreVersions(false);
    setInitialFetching(true);

    fetchInitialVersions();
  };

  const deleteVersion = async (versionID: string) => {
    await client.api.version.delete(versionID);
    setVersionList((prevList) => prevList.filter((version) => version.versionID !== versionID));
  };

  return { versionList, deleteVersion, resetState, initialFetching, loadingMore, noMoreVersions, onLoadMore, fetchInitialVersions };
};
