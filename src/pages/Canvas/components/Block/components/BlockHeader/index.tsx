import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { BlockVariant } from '@/constants/canvas';
import { withTheme } from '@/hocs';
import { Theme } from '@/styles/theme';
import { Icon } from '@/svgs/types';
import { unhighlightAllText, withEnterPress } from '@/utils/dom';

import { Container, IconContainer, Input } from './components';

export type BlockHeaderProps = {
  variant: BlockVariant;
  name: string;
  icon?: Icon;
  isEditing?: boolean;
  disabled?: boolean;
  canEditTitle?: boolean;
  isActivated?: boolean;
  updateName?: (value: string) => void;
  setIsEditing?: (value: boolean) => void;
  titleRef?: React.MutableRefObject<HTMLInputElement | null>;
};

const NewBlockHeader: React.FC<BlockHeaderProps & { theme: Theme }> = ({
  name,
  canEditTitle,
  isEditing,
  setIsEditing,
  icon,
  theme,
  updateName,
  variant,
  disabled,
  titleRef,
  isActivated,
}) => {
  const [blockLabel, setBlockLabel] = React.useState(name);
  const readOnly = !isEditing || disabled || !canEditTitle;

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
    if (disabled) {
      saveLabel();
    }
  }, [disabled]);

  React.useEffect(() => {
    if (readOnly) {
      unhighlightAllText();
    }
  }, [readOnly]);

  React.useEffect(() => {
    const variantStyles = theme.components.block.variants[variant];
    const color = variantStyles[isActivated ? 'activeColor' : 'color'];

    if (titleRef?.current) {
      titleRef.current.style.color = color;
    }
  }, [theme, variant, isActivated]);

  return (
    <Container hasIcon={!!icon}>
      {icon && (
        <IconContainer>
          <SvgIcon icon={icon} color="#6e849a" />
        </IconContainer>
      )}
      <Input
        canEdit={canEditTitle}
        onClick={startEditMode}
        onBlur={saveLabel}
        readOnly={readOnly}
        onChange={updateLabel}
        value={blockLabel}
        variant={variant}
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

export default withTheme(NewBlockHeader);
