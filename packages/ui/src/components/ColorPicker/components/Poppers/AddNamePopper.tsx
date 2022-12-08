import Input from '@ui/components/Input';
import { usePopper } from '@ui/hooks';
import { styled } from '@ui/styles';
import { stopPropagation } from '@ui/utils';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import Badge from '../../../Badge';
import { Label, PopperContent } from '../../styles';

const StyledInput = styled(Input)`
  min-height: 25px;
  font-size: 15px;
`;

const StyledBadge = styled(Badge)`
  cursor: pointer;
`;

interface PopperProps {
  isEditing: boolean;
  onRename?: (name: string) => void;
  value?: string;
}

export const AddNamePopper: React.FC<PopperProps> = ({ isEditing, onRename, value = '' }) => {
  const popperContainerRef = React.useRef<HTMLDivElement>(null);
  const [name, setName] = React.useState<string>(value);
  const rootPopper = usePopper({
    placement: 'bottom',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
    strategy: 'fixed',
  });

  const [, , closePopper] = useDismissable(isEditing, {
    ref: popperContainerRef,
    onClose: () => onRename?.(name),
  });

  const onSaveColor = () => {
    onRename?.(name);
    closePopper();
  };

  return (
    <div ref={rootPopper.setReferenceElement}>
      {isEditing && (
        <div ref={popperContainerRef}>
          <div ref={rootPopper.setPopperElement} style={{ ...rootPopper.styles.popper, width: '260px' }} {...rootPopper.attributes.popper}>
            <PopperContent onClick={stopPropagation(null, true)}>
              <Label>Color Label</Label>
              <StyledInput
                autoFocus
                autoSelectText
                value={name}
                placeholder="Enter label"
                onChangeText={setName}
                onEnterPress={onSaveColor}
                rightAction={
                  name ? (
                    <StyledBadge slide onClick={onSaveColor}>
                      Enter
                    </StyledBadge>
                  ) : null
                }
              />
            </PopperContent>
          </div>
        </div>
      )}
    </div>
  );
};
