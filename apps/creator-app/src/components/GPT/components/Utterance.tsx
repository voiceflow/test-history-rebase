import composeRef from '@seznam/compose-react-refs';
import * as Platform from '@voiceflow/platform-config';
import { Box, SectionV2, stopPropagation, useDidUpdateEffect, usePopper } from '@voiceflow/ui';
import React from 'react';

import type { TextEditorVariable } from '@/components/TextEditor/types';
import Utterance from '@/components/Utterance';
import { useAutoScrollNodeIntoView } from '@/hooks';

import Popper from './Popper';

interface GPTUtteranceProps {
  input: Platform.Base.Models.Intent.Input;
  index: number;
  slots: TextEditorVariable[];
  onFocus: VoidFunction;
  onChange: (input: Partial<Platform.Base.Models.Intent.Input>) => void;
  onReject: VoidFunction;
  isActive?: boolean;
  activeIndex?: number;
}

const GPTUtterance: React.FC<GPTUtteranceProps> = ({ index, input, onFocus, isActive, onChange, onReject, slots, activeIndex }) => {
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
          <Utterance space slots={slots} value={input.text} isActive={isActive} onBlur={onChange} onEnterPress={onChange} creatable={false} />
        </Box>
      </SectionV2.ListItem>

      {isActive && (
        <Popper
          {...popper.attributes.popper}
          ref={popper.setPopperElement}
          style={popper.styles.popper}
          label="utterances"
          storageKey="recommended-utterances"
          description="Closing the modal or navigating away will accept all utterances."
        />
      )}
    </Box>
  );
};

export default GPTUtterance;
