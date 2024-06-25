import composeRef from '@seznam/compose-react-refs';
import { Utils } from '@voiceflow/common';
import type { Entity } from '@voiceflow/dtos';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, stopPropagation, usePersistFunction, usePopper } from '@voiceflow/ui';
import React from 'react';

import EntityPrompt from '@/components/EntityPrompt';
import { useAutoScrollNodeIntoView } from '@/hooks';

import Popper from './Popper';

interface GPTEntityPromptProps {
  index: number;
  onFocus: VoidFunction;
  prompt: unknown;
  onChange: (prompt: unknown) => void;
  onReject: VoidFunction;
  entities: Array<Realtime.Slot | Entity>;
  isActive?: boolean;
  activeIndex?: number;
}

const GPTEntityPrompt: React.FC<GPTEntityPromptProps> = ({
  index,
  prompt,
  onFocus,
  isActive,
  onChange,
  onReject,
  entities,
  activeIndex,
}) => {
  const [ref] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: isActive, options: { block: 'nearest' } }, [
    isActive,
    activeIndex,
  ]);

  const popper = usePopper({
    placement: 'left-start',
    strategy: 'absolute',
    modifiers: [
      { name: 'offset', options: { offset: [0, 32] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
  });

  const persistedForceUpdate = usePersistFunction(popper.update);

  React.useEffect(() => {
    if (!isActive) return Utils.functional.noop;

    persistedForceUpdate();

    // extra update to fix popper position when sidebar animation is done
    const timeoutID = setTimeout(() => persistedForceUpdate(), 150);

    return () => clearTimeout(timeoutID);
  }, [isActive, index]);

  return (
    <Box ref={composeRef<HTMLDivElement>(ref, popper.setReferenceElement)} onClick={() => onFocus()}>
      <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={stopPropagation(onReject)} />}>
        <Box width="100%" opacity={isActive ? 1 : 0.5}>
          <EntityPrompt prompt={prompt} slots={entities} isActive={isActive} onChange={onChange} />
        </Box>
      </SectionV2.ListItem>

      {isActive && (
        <Popper
          {...popper.attributes.popper}
          ref={popper.setPopperElement}
          style={popper.styles.popper}
          label="response"
          storageKey="recommended-entity-prompt"
          description="Closing the modal or navigating away will accept all responses."
        />
      )}
    </Box>
  );
};

export default GPTEntityPrompt;
