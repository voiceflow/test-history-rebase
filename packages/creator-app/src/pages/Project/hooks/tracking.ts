import React from 'react';
import { matchPath } from 'react-router';
import { useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveProjectConfig, useSelector, useTrackingEvents } from '@/hooks';

export enum TrackingArea {
  CANVAS = 'canvas',
  PROTOTYPE = 'prototype',
  TRANSCRIPTS = 'transcripts',
  NLU_MANAGER = 'nlu',
}

const trackingPaths = [
  { area: TrackingArea.PROTOTYPE, path: Path.PROJECT_PROTOTYPE },
  { area: TrackingArea.TRANSCRIPTS, path: Path.CONVERSATIONS },
  { area: TrackingArea.CANVAS, path: Path.DOMAIN_CANVAS },
  { area: TrackingArea.NLU_MANAGER, path: Path.NLU_MANAGER },
];

export const useProjectExitTracking = () => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const creatorID = useSelector(Account.userIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);

  const activeProject = useActiveProjectConfig();

  const durationsRef = React.useRef({
    [TrackingArea.CANVAS]: 0,
    [TrackingArea.PROTOTYPE]: 0,
    [TrackingArea.TRANSCRIPTS]: 0,
    [TrackingArea.NLU_MANAGER]: 0,
  });
  const areaTimeRef = React.useRef(0);
  const location = useLocation();
  const pathnameRef = React.useRef(location.pathname);
  const [trackingEvents] = useTrackingEvents();

  const track = (pathname: string) => {
    const match = trackingPaths.find(({ path }) => matchPath(pathname, path));

    if (match) {
      durationsRef.current[match.area] += Date.now() - areaTimeRef.current;
    }
  };

  React.useEffect(() => {
    const { pathname } = location;

    pathnameRef.current = pathname;
    areaTimeRef.current = Date.now();

    return () => track(pathname);
  }, [location.pathname]);

  React.useEffect(() => {
    const mountTime = Date.now();

    const trackPayload = {
      nluType: activeProject.nlu,
      platform: activeProject.platform,
      projectID,
      creatorID,
      versionID,
      workspaceID,
      projectType: activeProject.projectType,
      organizationID,
    };

    trackingEvents.trackActiveProjectSessionBegin(trackPayload);

    const trackSession = () => {
      track(pathnameRef.current);
      const durations = durationsRef.current;

      trackingEvents.trackProjectExit({
        ...trackPayload,
        canvasSessionDuration: Math.floor(durations.canvas / 1000),
        prototypeSessionDuration: Math.floor(durations.prototype / 1000),
        nluManagerSessionDuration: Math.floor(durations.nlu / 1000),
        transcriptsSessionDuration: Math.floor(durations.transcripts / 1000),
      });

      trackingEvents.trackActiveProjectSessionDuration({
        ...trackPayload,
        duration: Math.floor((Date.now() - mountTime) / 1000),
      });
    };

    window.addEventListener('beforeunload', trackSession);

    return () => {
      window.removeEventListener('beforeunload', trackSession);
      trackSession();
    };
  }, []);
};
