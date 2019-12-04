/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';

import { User } from '@/admin/containers/Home/components/User/User';
import { KeyCodes } from '@/constants';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import * as Realtime from '@/ducks/realtime';
import { styled } from '@/hocs';
import { useEnableDisable, useImperativeApi } from '@/hooks';
import { stopPropagation } from '@/utils/dom';

import CombinedBlockInput, { combinedBlockInputStyle } from './CombinedBlockInput';

const Label = styled.span`
  &:hover:not([disabled]) {
    ${combinedBlockInputStyle}
  }

  .avatar {
    position: absolute;
    top: -6px;
    left: -10px;
    z-index: 99;
  }
`;

const CombinedBlockLabel = ({ value, lockOwner, nodeID, onChange }, ref) => {
  const [name, setName] = React.useState(value);
  const engine = React.useContext(EngineContext);
  const [isEditing, enableEditing, disableEditing] = useEnableDisable(false);
  const inputRef = useImperativeApi({ ref, deps: [enableEditing], creator: () => ({ enableEditing }) });

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
        <Label onClick={!lockOwner && onLabelClick} disabled={!!lockOwner}>
          {name}
          {lockOwner && <User user={lockOwner} className="avatar" />}
        </Label>
      )}
    </>
  );
};

export default React.forwardRef(CombinedBlockLabel);
