/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';

import { KeyCodes } from '@/constants';
import { styled } from '@/hocs';
import { useEnableDisable, useImperativeApi } from '@/hooks';
import { stopPropagation } from '@/utils/dom';

import CombinedBlockInput, { combinedBlockInputStyle } from './CombinedBlockInput';

const Label = styled.span`
  &:hover {
    ${combinedBlockInputStyle}
  }
`;

const CombinedBlockLabel = ({ value, onChange }, ref) => {
  const [name, setName] = React.useState(value);
  const [isEditing, enableEditing, disableEditing] = useEnableDisable(false);
  const inputRef = useImperativeApi({ ref, deps: [enableEditing], creator: () => ({ enableEditing }) });

  const updateName = () => {
    disableEditing();
    onChange(name);
  };

  const onKeyPress = (e) => {
    if (e.charCode !== KeyCodes.ENTER) {
      return;
    }

    updateName();
  };

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current.select();
    }
  }, [isEditing]);

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
        <Label onClick={enableEditing}>{name}</Label>
      )}
    </>
  );
};

export default React.forwardRef(CombinedBlockLabel);
