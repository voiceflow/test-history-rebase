import React from 'react';

import Button from '@/components/Button';
import User from '@/components/User';
import { useEditLock, useResourceLock } from '@/pages/Canvas/hooks';

import { Container } from './components';

const LockedEditorOverlay = ({ lockOwner, prevOwner, acquireLock }) => {
  if (!lockOwner && !prevOwner) return null;

  if (lockOwner) {
    return (
      <Container>
        <User user={lockOwner} large />
        <p>{lockOwner.name} is hard at work here, check back soon to access this section</p>
      </Container>
    );
  }

  return (
    <Container>
      <p>{prevOwner.name} is all done, you can now takeover edit access</p>
      <Button variant="secondary" onClick={acquireLock}>
        Enter Editor
      </Button>
    </Container>
  );
};

export default LockedEditorOverlay;

export const LockedBlockOverlay = ({ nodeID, disabled = false, children }) => {
  const { lockOwner, prevOwner, acquireLock, forceUpdateKey } = useEditLock(nodeID, disabled);

  return (
    <>
      {children?.(forceUpdateKey)}
      <LockedEditorOverlay lockOwner={lockOwner} prevOwner={prevOwner} acquireLock={acquireLock} />
    </>
  );
};

export const LockedResourceOverlay = ({ type, disabled = false, children }) => {
  const { lockOwner, prevOwner, acquireLock, forceUpdateKey } = useResourceLock(type, disabled);

  return (
    <>
      {children?.({ lockOwner, prevOwner, forceUpdateKey })}
      <LockedEditorOverlay lockOwner={lockOwner} prevOwner={prevOwner} acquireLock={acquireLock} />
    </>
  );
};
