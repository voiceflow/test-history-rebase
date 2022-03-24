/* eslint-disable import/prefer-default-export */
import { usePopper } from '@ui/hooks';
import { stopPropagation } from '@ui/utils';
import React from 'react';
import styled from 'styled-components';

import Badge from '../../../Badge';
import Input from '../../../Input';
import Portal from '../../../Portal';
import { Label, PopperContent } from '../../styles';

const StyledInput = styled(Input)`
  min-height: 25px;
  font-size: 15px;
  width: calc(100% - 35px);
`;

interface PopperProps {
  isEditing: boolean;
}

export const AddNamePopper: React.FC<PopperProps> = ({ isEditing }) => {
  const rootPopper = usePopper({
    placement: 'bottom',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
    strategy: 'fixed',
  });

  return (
    <div ref={rootPopper.setReferenceElement}>
      {isEditing && (
        <Portal portalNode={document.body}>
          <div ref={rootPopper.setPopperElement} style={rootPopper.styles.popper} {...rootPopper.attributes.popper}>
            <PopperContent onClick={stopPropagation(null, true)}>
              <Label>Color Label</Label>
              <StyledInput rightAction={<Badge>Enter</Badge>} />
            </PopperContent>
          </div>
        </Portal>
      )}
    </div>
  );
};
