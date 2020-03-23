import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { BlockState, BlockVariant } from '@/constants/canvas';
import { Icon } from '@/svgs/types';
import { withEnterPress } from '@/utils/dom';

import { Container, IconContainer, Input } from './components';

export type NewBlockHeaderProps = {
  state: BlockState;
  variant: BlockVariant;
  name: string;
  icon?: Icon;
  isEditing?: boolean;
  canEditTitle?: boolean;
  updateName?: (value: string) => void;
  setIsEditing?: (value: boolean) => void;
  titleRef?: React.MutableRefObject<HTMLInputElement | null>;
};

const NewBlockHeader: React.FC<NewBlockHeaderProps> = ({
  name,
  canEditTitle,
  isEditing,
  setIsEditing,
  icon,
  updateName,
  variant,
  state,
  titleRef,
}) => {
  const [blockLabel, setBlockLabel] = React.useState(name);
  const readOnly = !isEditing || state === BlockState.DISABLED || !canEditTitle;
  const saveLabel = () => {
    if (blockLabel.trim() === '') {
      setBlockLabel(name);
    } else {
      updateName?.(blockLabel);
    }
    setIsEditing?.(false);
  };

  const updateLabel: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    setBlockLabel(currentTarget.value);
  };

  const startEditMode: React.MouseEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    if (!canEditTitle) {
      return;
    }
    setIsEditing?.(true);
    currentTarget.select();
  };

  const handleEnterPress: React.KeyboardEventHandler<HTMLInputElement> = async ({ currentTarget }) => {
    saveLabel();
    currentTarget.blur();
  };

  React.useEffect(() => {
    setBlockLabel(name);
  }, [name]);

  React.useEffect(() => {
    if (state === BlockState.DISABLED) {
      saveLabel();
    }
  }, [state]);

  return (
    <Container hasIcon={!!icon}>
      {icon && (
        <IconContainer>
          <SvgIcon icon={icon} color="#6e849a" />
        </IconContainer>
      )}
      <Input
        // for some reason I NEED to place box sizing inline for the title to not get cropped on first render in chrome
        style={{ boxSizing: 'content-box' }}
        canEdit={canEditTitle}
        onFocus={(e) => {
          if (!readOnly) {
            e.currentTarget.select();
          }
        }}
        onClick={(e) => {
          startEditMode(e);
        }}
        onBlur={saveLabel}
        readOnly={readOnly}
        onChange={updateLabel}
        value={blockLabel}
        variant={variant}
        state={state}
        onKeyPress={withEnterPress(handleEnterPress)}
        inputRef={(ref: HTMLInputElement | null) => {
          if (titleRef) {
            titleRef.current = ref;
          }
        }}
      />
    </Container>
  );
};

export default NewBlockHeader;
