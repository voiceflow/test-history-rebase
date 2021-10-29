import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import User from '@/components/User';
import { FeatureFlag } from '@/config/features';
import * as Realtime from '@/ducks/realtime';
import { useFeature } from '@/hooks';
import { LockOwner } from '@/models';
import { useEditLock, useResourceLock } from '@/pages/Canvas/hooks';

import { Container } from './components';

export interface LockedEditorOverlayProps {
  acquireLock: () => void;
  lockOwner: LockOwner | null;
  prevOwner: LockOwner | null;
}

const LockedEditorOverlay: React.FC<LockedEditorOverlayProps> = ({ lockOwner, prevOwner, acquireLock }) => {
  if (!lockOwner && !prevOwner) return null;

  if (lockOwner) {
    return (
      <Container>
        <User user={lockOwner} large />
        <p>{lockOwner.name} is hard at work here, check back soon to access</p>
      </Container>
    );
  }

  return (
    <Container>
      <p>{prevOwner!.name} is all done, you can now takeover edit access</p>
      <Button variant={ButtonVariant.SECONDARY} onClick={acquireLock}>
        Enter
      </Button>
    </Container>
  );
};

export default LockedEditorOverlay;

export interface LockedBlockOverlayProps {
  nodeID: string;
  disabled?: boolean;
  children?: (forceUpdateKey: number | null) => React.ReactNode;
}

export const LockedBlockOverlay: React.FC<LockedBlockOverlayProps> = ({ nodeID, disabled = false, children }) => {
  const { lockOwner, prevOwner, acquireLock, forceUpdateKey } = useEditLock(nodeID, disabled);

  return (
    <>
      {children?.(forceUpdateKey)}
      <LockedEditorOverlay lockOwner={lockOwner} prevOwner={prevOwner} acquireLock={acquireLock} />
    </>
  );
};

export interface LockedResourceOverlayProps {
  type: Realtime.ResourceType;
  disabled?: boolean;
  children?: (props: { forceUpdateKey: number | null; lockOwner: LockOwner | null; prevOwner: LockOwner | null }) => React.ReactNode;
}

export const LockedResourceOverlay: React.FC<LockedResourceOverlayProps> = ({ type, disabled = false, children }) => {
  const { lockOwner, prevOwner, acquireLock, forceUpdateKey } = useResourceLock(type, disabled);
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS_PHASE_2);

  if (atomicActions.isEnabled) {
    return <>{children?.({ lockOwner: null, prevOwner: null, forceUpdateKey })}</>;
  }

  return (
    <>
      {children?.({ lockOwner, prevOwner, forceUpdateKey })}
      <LockedEditorOverlay lockOwner={lockOwner} prevOwner={prevOwner} acquireLock={acquireLock} />
    </>
  );
};
