import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import client from '@/client';
import * as Project from '@/ducks/project';
import { activeProjectIDSelector } from '@/ducks/session';
import { useDispatch } from '@/hooks';

// Patch the `liveVersion` for the current project after publish
export const usePatchLiveVersion = (successfullyPublished: boolean) => {
  const activeProjectID = useSelector(activeProjectIDSelector)!;
  const updateProjectLiveVersion = useDispatch(Project.updateProjectLiveVersion);

  useEffect(() => {
    if (successfullyPublished) {
      client.api.project.get(activeProjectID!, ['liveVersion']).then(({ liveVersion }) => {
        updateProjectLiveVersion(activeProjectID, liveVersion!);
      });
    }
  }, [successfullyPublished]);
};
