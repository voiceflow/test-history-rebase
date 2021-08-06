import { Icon, preventDefault, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import { BlockVariant } from '@/constants/canvas';
import { BLOCK_SECTION_TITLE_CLASSNAME } from '@/pages/Canvas/constants';
import { useEditingMode } from '@/pages/Skill/hooks';
import { withEnterPress } from '@/utils/dom';

import { Container, IconContainer, Input } from './components';

export interface BlockHeaderProps {
  variant: BlockVariant;
  name?: string;
  icon?: Icon;
  nodeID: string;
  isDisabled?: boolean;
  isLocked?: boolean;
  canEditTitle?: boolean;
  updateName?: (value: string) => void;
  titleRef?: React.Ref<EditableTextAPI | null>;
  actions?: JSX.Element;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({
  name,
  nodeID,
  canEditTitle,
  icon,
  updateName,
  variant,
  isDisabled,
  isLocked,
  titleRef,
  actions,
}) => {
  const isEditingMode = useEditingMode();

  const [blockLabel, setBlockLabel] = React.useState(name ?? '');
  const readOnly = isDisabled || !canEditTitle;

  const saveLabel = () => {
    if (blockLabel.trim() === '') {
      setBlockLabel(name ?? '');
    } else {
      updateName?.(blockLabel);
    }
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

  return (
    <Container>
      {icon && (
        <IconContainer side="left">
          <SvgIcon icon={icon} color="#6e849a" />
        </IconContainer>
      )}
      <Input
        className={BLOCK_SECTION_TITLE_CLASSNAME}
        viewOnlyMode={!isEditingMode}
        canEdit={canEditTitle}
        onMouseUp={preventDefault()}
        onBlur={saveLabel}
        readOnly={readOnly}
        onChange={setBlockLabel}
        value={blockLabel}
        variant={variant}
        tabIndex={-1}
        onKeyPress={withEnterPress(handleEnterPress)}
        ref={titleRef}
        nodeID={nodeID}
      />
      <IconContainer side="right">
        {isLocked && <SvgIcon icon="lock" />}
        {actions}
      </IconContainer>
    </Container>
  );
};

export default BlockHeader;
