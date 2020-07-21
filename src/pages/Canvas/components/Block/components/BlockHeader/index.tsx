import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { BlockVariant } from '@/constants/canvas';
import { BLOCK_SECTION_TITLE_CLASSNAME } from '@/pages/Canvas/constants';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import { Icon } from '@/svgs/types';
import { preventDefault, unhighlightAllText, withEnterPress } from '@/utils/dom';

import { Container, IconContainer, Input } from './components';

export type BlockHeaderProps = {
  variant: BlockVariant;
  name?: string;
  icon?: Icon;
  isEditing?: boolean;
  isDisabled?: boolean;
  isLocked?: boolean;
  canEditTitle?: boolean;
  updateName?: (value: string) => void;
  setIsEditing?: (value: boolean) => void;
  titleRef?: React.MutableRefObject<HTMLInputElement | null>;
};

const NewBlockHeader: React.FC<BlockHeaderProps> = ({
  name,
  canEditTitle,
  isEditing,
  setIsEditing,
  icon,
  updateName,
  variant,
  isDisabled,
  isLocked,
  titleRef,
}) => {
  const editPermission = React.useContext(EditPermissionContext)!;

  const [blockLabel, setBlockLabel] = React.useState(name ?? '');
  const readOnly = !isEditing || isDisabled || !canEditTitle;

  const saveLabel = () => {
    if (blockLabel.trim() === '') {
      setBlockLabel(name ?? '');
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
    setBlockLabel(name ?? '');
  }, [name]);

  React.useEffect(() => {
    if (isDisabled) {
      saveLabel();
    }
  }, [isDisabled]);

  React.useEffect(() => {
    if (readOnly) {
      unhighlightAllText();
    }
  }, [readOnly]);

  return (
    <Container hasIcon={!!icon}>
      {icon && (
        <IconContainer side="left">
          <SvgIcon icon={icon} color="#6e849a" />
        </IconContainer>
      )}
      <Input
        className={BLOCK_SECTION_TITLE_CLASSNAME}
        viewOnlyMode={!editPermission.canEdit}
        canEdit={canEditTitle}
        onClick={startEditMode}
        onMouseUp={preventDefault()}
        onBlur={saveLabel}
        readOnly={readOnly}
        onChange={updateLabel}
        value={blockLabel}
        variant={variant}
        tabIndex={-1}
        onKeyPress={withEnterPress(handleEnterPress)}
        inputRef={(ref: HTMLInputElement | null) => {
          if (titleRef) {
            titleRef.current = ref;
          }
        }}
      />
      {isLocked && (
        <IconContainer side="right">
          <SvgIcon icon="lock" />
        </IconContainer>
      )}
    </Container>
  );
};

export default NewBlockHeader;
