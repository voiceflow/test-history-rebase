import * as Platform from '@voiceflow/platform-config';
import React from 'react';
import { matchPath } from 'react-router';
import { useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Account from '@/ducks/account';
import * as Session from '@/ducks/session';
import { useSelector, useTrackingEvents, useWorkspaceTracking } from '@/hooks';

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

export function useProjectExitTracking({
  nluType,
  platform,
}: {
  nluType: Platform.Constants.NLUType;
  platform: Platform.Constants.PlatformType;
}): void {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const creatorID = useSelector(Account.userIDSelector)!;

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

  useWorkspaceTracking();

  React.useEffect(() => {
    const { pathname } = location;

    pathnameRef.current = pathname;
    areaTimeRef.current = Date.now();

    return () => track(pathname);
  }, [location.pathname]);

  React.useEffect(() => {
    const mountTime = Date.now();
    trackingEvents.trackActiveProjectSessionBegin({
      skillID: versionID,
      projectID,
      workspaceID,
      creatorID,
    });

    const trackSession = () => {
      track(pathnameRef.current);
      const durations = durationsRef.current;

      trackingEvents.trackProjectExit({
        nluType,
        platform,
        creatorID,
        canvasSessionDuration: durations.canvas,
        prototypeSessionDuration: durations.prototype,
        transcriptsSessionDuration: durations.transcripts,
        nluManagerSessionDuration: durations.nlu,
      });

      trackingEvents.trackActiveProjectSessionDuration({
        skillID: versionID,
        duration: Date.now() - mountTime,
        projectID,
        workspaceID,
        creatorID,
      });
    };

    window.addEventListener('beforeunload', trackSession);

    return () => {
      window.removeEventListener('beforeunload', trackSession);
      trackSession();
    };
  }, []);
}
