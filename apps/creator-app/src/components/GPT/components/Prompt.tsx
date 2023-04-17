import composeRef from '@seznam/compose-react-refs';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { Box, SectionV2, stopPropagation, usePersistFunction, usePopper } from '@voiceflow/ui';
import React from 'react';

import Prompt from '@/components/Prompt';
import { useAutoScrollNodeIntoView } from '@/hooks';

import Popper from './Popper';

interface GPTPromptProps {
  index: number;
  onFocus: VoidFunction;
  prompt: Platform.Base.Models.Prompt.Model;
  onChange: (prompt: Partial<Platform.Base.Models.Prompt.Model>) => void;
  onReject: VoidFunction;
  isActive?: boolean;
  storageKey: string;
  popperLabel: string;
  activeIndex?: number;
  popperDescription: string;
}

const GPTPrompt: React.FC<GPTPromptProps> = ({
  index,
  prompt,
  onFocus,
  isActive,
  onChange,
  onReject,
  storageKey,
  popperLabel,
  activeIndex,
  popperDescription,
}) => {
  const [ref] = useAutoScrollNodeIntoView<HTMLDivElement>({ condition: isActive, options: { block: 'nearest' } }, [isActive, activeIndex]);

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
          <Prompt message={prompt} isActive={isActive} onChange={onChange} />
        </Box>
      </SectionV2.ListItem>

      {isActive && (
        <Popper
          {...popper.attributes.popper}
          ref={popper.setPopperElement}
          style={popper.styles.popper}
          label={popperLabel}
          storageKey={storageKey}
          description={popperDescription}
        />
      )}
    </Box>
  );
};

export default GPTPrompt;
