import { Button, ButtonVariant, User } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { useSelector } from '@/hooks';
import { LockOwner } from '@/models';
import { useEditLock } from '@/pages/Canvas/hooks/locking';

import { Container } from './components';

export interface LockedEditorOverlayProps {
  acquireLock: () => void;
  lockOwner: LockOwner | null;
  prevOwner: LockOwner | null;
}

const LockedEditorOverlay: React.FC<LockedEditorOverlayProps> = ({ lockOwner, prevOwner, acquireLock }) => {
  const userID = useSelector(Account.userIDSelector);

  if (lockOwner && lockOwner.creatorID !== userID) {
    return (
      <Container>
        <User user={lockOwner} large />
        <p>{lockOwner.name} is hard at work here, check back soon to access</p>
      </Container>
    );
  }

  if (prevOwner && prevOwner.creatorID !== userID) {
    return (
      <Container>
        <p>{prevOwner.name} is all done, you can now takeover edit access</p>
        <Button variant={ButtonVariant.SECONDARY} onClick={acquireLock}>
          Enter
        </Button>
      </Container>
    );
  }

  return null;
};

export default LockedEditorOverlay;

export interface LockedBlockOverlayProps {
  nodeID: string;
  disabled?: boolean;
  children?: (forceUpdateKey: number | null) => React.ReactNode;
}

export const PassthroughBlockOverlay: React.FC<LockedBlockOverlayProps> = ({ children }) => <>{children?.(-1)}</>;

export const LockedBlockOverlay: React.FC<LockedBlockOverlayProps> = ({ nodeID, disabled = false, children }) => {
  const { lockOwner, prevOwner, acquireLock, forceUpdateKey } = useEditLock(nodeID, disabled);

  return (
    <>
      {children?.(forceUpdateKey)}
      <LockedEditorOverlay lockOwner={lockOwner} prevOwner={prevOwner} acquireLock={acquireLock} />
    </>
  );
};
