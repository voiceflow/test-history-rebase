import { Icon, stopPropagation, SvgIcon, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import { BlockVariant } from '@/constants/canvas';
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
  icon?: Icon;
  nodeID: string;
  variant: BlockVariant;
  actions?: JSX.Element;
  titleRef?: React.Ref<EditableTextAPI | null> & { current?: any };
  isDisabled?: boolean;
  updateName?: (value: string) => void;
  canEditTitle?: boolean;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({ name, icon, nodeID, variant, actions, titleRef, updateName, isDisabled, canEditTitle }) => {
  const isEditingMode = useEditingMode();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [editing, setEditing] = React.useState(false);
  const [blockLabel, setBlockLabel] = useLinkedState(name ?? '');
  const readOnly = isDisabled || !canEditTitle || !isEditingMode;

  const saveLabel = () => {
    if (blockLabel.trim() === '') {
      setBlockLabel(name ?? '');
    } else {
      updateName?.(blockLabel);
    }
  };

  const handleOnBlur = () => {
    saveLabel();
    setEditing(false);
  };

  const handleEnterPress: React.KeyboardEventHandler<HTMLInputElement> = async ({ shiftKey, currentTarget }) => {
    if (!shiftKey) {
      handleOnBlur();
      currentTarget.blur();
    }
  };

  React.useEffect(() => {
    if (isDisabled) {
      saveLabel();
    }
  }, [isDisabled]);

  React.useEffect(() => {
    if (!editing) {
      return;
    }

    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, [editing]);

  const handleOnBlurPersisted = usePersistFunction(handleOnBlur);

  React.useImperativeHandle(
    titleRef,
    () => ({
      startEditing: () => {
        setEditing(true);
      },

      stopEditing: () => {
        handleOnBlurPersisted();
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
        <InputContainer>
          <Input
            value={blockLabel}
            nodeID={nodeID}
            onBlur={handleOnBlur}
            variant={variant}
            onClick={stopPropagation()}
            inputRef={textareaRef}
            onChange={withTargetValue(setBlockLabel)}
            tabIndex={-1}
            className={BLOCK_SECTION_TITLE_CLASSNAME}
            // eslint-disable-next-line jsx-a11y/no-autofocus
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
                  nodeID={nodeID}
                  variant={variant}
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
