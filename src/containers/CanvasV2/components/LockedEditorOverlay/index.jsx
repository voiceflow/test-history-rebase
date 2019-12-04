import React from 'react';

import { User } from '@/components/User/User';
import Button from '@/componentsV2/Button';
import { useEditLock, useResourceLock } from '@/containers/CanvasV2/hooks';

import { Container } from './components';

const LockedEditorOverlay = ({ lockOwner, prevOwner, acquireLock }) => {
  if (!lockOwner && !prevOwner) return null;

  if (lockOwner) {
    return (
      <Container>
        <User user={lockOwner} className="avatar" />
        <p>{lockOwner.name} is hard at work here, check back soon to access this editor</p>
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
