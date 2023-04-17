import composeRef from '@seznam/compose-react-refs';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, stopPropagation, useDidUpdateEffect, usePopper } from '@voiceflow/ui';
import React from 'react';

import EntityValueInput from '@/components/EntityValueInput';
import { useAutoScrollNodeIntoView } from '@/hooks/scroll';

import Popper from './Popper';

interface GPTEntityValueProps {
  input: Realtime.SlotInput;
  index: number;
  onFocus: VoidFunction;
  onChange: (input: Partial<Realtime.SlotInput>) => void;
  onReject: VoidFunction;
  isActive?: boolean;
  activeIndex?: number;
}

const GPTEntityValue: React.FC<GPTEntityValueProps> = ({ index, input, onFocus, isActive, onChange, onReject, activeIndex }) => {
  const [ref] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: isActive, options: { block: 'nearest' } }, [isActive, activeIndex]);

  const popper = usePopper({
    placement: 'left-start',
    strategy: 'absolute',
    modifiers: [
      { name: 'offset', options: { offset: [0, 32] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
  });

  useDidUpdateEffect(() => {
    if (isActive) {
      popper.update?.();
    }
  }, [isActive, index]);

  return (
    <Box ref={composeRef<HTMLDivElement>(ref, popper.setReferenceElement)} onClick={() => onFocus()}>
      <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={stopPropagation(onReject)} />}>
        <Box width="100%" opacity={isActive ? 1 : 0.5}>
          <EntityValueInput entity={input} isActive={isActive} onChange={(data) => onChange(data)} />
        </Box>
      </SectionV2.ListItem>

      {isActive && (
        <Popper
          {...popper.attributes.popper}
          ref={popper.setPopperElement}
          style={popper.styles.popper}
          label="value"
          storageKey="recommended-entity-values"
          description="Closing the modal or navigating away will accept all values."
        />
      )}
    </Box>
  );
};

export default GPTEntityValue;
