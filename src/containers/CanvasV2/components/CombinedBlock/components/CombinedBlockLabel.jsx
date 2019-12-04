/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';

import User, { MemberIcon } from '@/components/User';
import { KeyCodes } from '@/constants';
import { EditPermissionContext, EngineContext } from '@/containers/CanvasV2/contexts';
import * as Realtime from '@/ducks/realtime';
import { styled } from '@/hocs';
import { useEnableDisable, useImperativeApi } from '@/hooks';
import { stopPropagation } from '@/utils/dom';

import CombinedBlockInput, { combinedBlockInputStyle } from './CombinedBlockInput';

const Label = styled.span`
  &:hover:not([disabled]) {
    ${combinedBlockInputStyle}
  }

  ${MemberIcon} {
    position: absolute;
    top: 6px;
    left: 3px;
    transform: translate(-50%, -50%);
    z-index: 99;
  }
`;

const CombinedBlockLabel = ({ value, lockOwner, nodeID, onChange }, ref) => {
  const [name, setName] = React.useState(value);
  const engine = React.useContext(EngineContext);
  const { canEdit } = React.useContext(EditPermissionContext);
  const [isEditing, enableEditing, disableEditing] = useEnableDisable(false);
  const inputRef = useImperativeApi({ ref, deps: [enableEditing], creator: () => ({ enableEditing }) });
  const editLocked = !canEdit || !!lockOwner;

  const updateName = async () => {
    await engine.realtime.sendUpdate(Realtime.unlockNodes([nodeID], [Realtime.LockType.EDIT]));
    disableEditing();
    onChange(name);
  };

  const onKeyPress = async (e) => {
    if (e.charCode !== KeyCodes.ENTER) {
      return;
    }

    await updateName();
  };

  const onLabelClick = async () => {
    await engine.realtime.sendUpdate(Realtime.lockNodes([nodeID], [Realtime.LockType.EDIT]));
    enableEditing();
  };

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current.select();
    }
  }, [isEditing]);

  React.useEffect(() => {
    setName(value);
  }, [value]);

  return (
    <>
      {isEditing ? (
        <CombinedBlockInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={onKeyPress}
          onBlur={updateName}
          onMouseDown={stopPropagation()}
          ref={inputRef}
        />
      ) : (
        <Label onClick={editLocked ? null : onLabelClick} disabled={editLocked}>
          {name}
          {lockOwner && <User user={lockOwner} />}
        </Label>
      )}
    </>
  );
};

export default React.forwardRef(CombinedBlockLabel);
