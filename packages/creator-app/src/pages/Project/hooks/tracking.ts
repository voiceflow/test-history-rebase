import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { matchPath } from 'react-router';
import { useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useSelector, useTrackingEvents, useWorkspaceTracking } from '@/hooks';

export enum TrackingArea {
  CANVAS = 'canvas',
  PROTOTYPE = 'prototype',
  TRANSCRIPTS = 'transcripts',
}

const trackingPaths = [
  { area: TrackingArea.PROTOTYPE, path: Path.PROJECT_PROTOTYPE },
  { area: TrackingArea.TRANSCRIPTS, path: Path.CONVERSATIONS },
  { area: TrackingArea.CANVAS, path: Path.DOMAIN_CANVAS },
];

export function useProjectExitTracking({ platform }: { platform: VoiceflowConstants.PlatformType }): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const durationsRef = React.useRef({
    [TrackingArea.CANVAS]: 0,
    [TrackingArea.PROTOTYPE]: 0,
    [TrackingArea.TRANSCRIPTS]: 0,
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
    });

    const trackSession = () => {
      track(pathnameRef.current);
      const durations = durationsRef.current;

      trackingEvents.trackProjectExit({
        canvasSessionDuration: durations.canvas,
        prototypeSessionDuration: durations.prototype,
        transcriptsSessionDuration: durations.transcripts,
        platform,
      });

      trackingEvents.trackActiveProjectSessionDuration({
        skillID: versionID,
        duration: Date.now() - mountTime,
        projectID,
        workspaceID,
      });
    };

    window.addEventListener('beforeunload', trackSession);

    return () => {
      window.removeEventListener('beforeunload', trackSession);
      trackSession();
    };
  }, []);
}
