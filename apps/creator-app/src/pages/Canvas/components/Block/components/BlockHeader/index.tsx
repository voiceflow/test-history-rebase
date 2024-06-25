import type { SvgIconTypes } from '@voiceflow/ui';
import { stopPropagation, SvgIcon, useDragTrap, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import type { EditableTextAPI } from '@/components/EditableText';
import type { HSLShades } from '@/constants';
import { useLinkedState } from '@/hooks';
import { BLOCK_SECTION_TITLE_CLASSNAME } from '@/pages/Canvas/constants';
import { useEditingMode } from '@/pages/Project/hooks';
import { withEnterPress, withTargetValue } from '@/utils/dom';

import {
  ActionsContainer,
  Container,
  Input,
  InputContainer,
  LeftIconContainer,
  RadiusContainer,
  Title,
  TitleContainer,
  TitleContainerInner,
} from './components';

export interface BlockHeaderProps {
  name?: string;
  icon?: SvgIconTypes.Icon;
  palette: HSLShades;
  actions?: JSX.Element;
  titleRef?: React.Ref<EditableTextAPI | null> & { current?: any };
  onRename?: (value: string) => void;
  isDisabled?: boolean;
  canEditTitle?: boolean;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({
  name,
  icon,
  palette,
  actions,
  titleRef,
  onRename,
  isDisabled,
  canEditTitle,
}) => {
  const isEditingMode = useEditingMode();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [editing, setEditing] = React.useState(false);
  const [blockLabel, setBlockLabel] = useLinkedState(name ?? '');
  const readOnly = isDisabled || !canEditTitle || !isEditingMode;

  const dragTrap = useDragTrap();

  const saveLabel = () => {
    if (blockLabel.trim() === '') {
      setBlockLabel(name ?? '');
    } else {
      onRename?.(blockLabel);
    }
  };
  const handleOnBlur = usePersistFunction(() => {
    saveLabel();
    setEditing(false);
  });

  const handleEnterPress: React.KeyboardEventHandler<HTMLInputElement> = async ({ shiftKey, currentTarget }) => {
    if (!shiftKey) {
      handleOnBlur();
      currentTarget.blur();
    }
  };

  React.useEffect(() => {
    if (isDisabled) saveLabel();
  }, [isDisabled]);

  React.useEffect(() => {
    if (!editing) {
      return;
    }

    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, [editing]);

  React.useImperativeHandle(
    titleRef,
    () => ({
      startEditing: () => {
        setEditing(true);
      },
      stopEditing: () => {
        handleOnBlur();
      },
    }),
    []
  );

  return (
    <Container>
      {icon && (
        <LeftIconContainer>
          <SvgIcon icon={icon} color="rgba(110, 132, 154, 0.8)" />
        </LeftIconContainer>
      )}

      {editing ? (
        <InputContainer {...dragTrap}>
          <Input
            value={blockLabel}
            onBlur={handleOnBlur}
            palette={palette}
            inputRef={textareaRef}
            onChange={withTargetValue(setBlockLabel)}
            tabIndex={-1}
            className={BLOCK_SECTION_TITLE_CLASSNAME}
            autoFocus
            onKeyPress={withEnterPress(handleEnterPress)}
            onDoubleClick={stopPropagation()}
          />
        </InputContainer>
      ) : (
        <>
          <TitleContainer>
            <RadiusContainer>
              <TitleContainerInner>
                <Title
                  palette={palette}
                  onClick={stopPropagation(() => setEditing(true))}
                  disabled={readOnly}
                  className={BLOCK_SECTION_TITLE_CLASSNAME}
                >
                  {blockLabel}
                </Title>
              </TitleContainerInner>
            </RadiusContainer>
          </TitleContainer>

          {!!actions && <ActionsContainer>{actions}</ActionsContainer>}
        </>
      )}
    </Container>
  );
};

export default BlockHeader;
