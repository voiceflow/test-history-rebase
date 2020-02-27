import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import * as Tracking from '@/ducks/tracking';
import * as Workspace from '@/ducks/workspace';

import { useOneTimeEffect } from './effect';
import { useSetup, useTeardown } from './lifecycle';

export const useSessionTracking = () => {
  const dispatch = useDispatch();
  const authToken = useSelector(Session.authTokenSelector);
  const startTime = React.useMemo(() => Date.now(), []);
  const trackSessionTime = React.useCallback(() => dispatch(Tracking.trackSessionDuration(Date.now() - startTime)), []);

  useOneTimeEffect(() => {
    if (!authToken) {
      return false;
    }

    dispatch(Tracking.trackSessionBegin());

    window.addEventListener('beforeunload', trackSessionTime);

    return true;
  }, [authToken]);
};

export const useCanvasTracking = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const activeSkill = React.useMemo(() => Skill.activeSkillSelector(store.getState()), []);
  const activeWorkspaceID = React.useMemo(() => Workspace.activeWorkspaceIDSelector(store.getState()), []);
  const startTime = React.useMemo(() => Date.now(), []);
  const trackCanvasTime = React.useCallback(
    () => dispatch(Tracking.trackCanvasTime(activeWorkspaceID, activeSkill.projectID, activeSkill.id, Date.now() - startTime)),
    []
  );

  useSetup(() => {
    dispatch(Tracking.trackActiveProjectOpened());

    window.addEventListener('beforeunload', trackCanvasTime);
  });

  useTeardown(() => {
    window.removeEventListener('beforeunload', trackCanvasTime);
    trackCanvasTime();
  });
};
