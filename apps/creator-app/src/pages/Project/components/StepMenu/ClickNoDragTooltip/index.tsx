import { Box, Portal, TippyTooltip, useLocalStorage, usePersistFunction, usePopper } from '@voiceflow/ui';
import React from 'react';

import { addStepGuide } from '@/assets';

import * as S from '../SubMenu/styles';

const NO_DRAG_CLICKS_KEY = 'SubMenuButton:NO_DRAG_CLICKS';

interface StepMenuClickNoDragTooltipProps {
  children: (options: { isOpen: boolean }) => React.ReactNode;
}

const StepMenuClickNoDragTooltip: React.FC<StepMenuClickNoDragTooltipProps> = ({ children }) => {
  const buttonRef = React.useRef<HTMLDivElement>(null);
  const popper = usePopper({ strategy: 'fixed', placement: 'right-start' });

  // number of times the user has clicked on the step without dragging
  // initialize to 5 so the user is over the threshold on first click
  const [getNoDragClicks, setNoDragClicks] = useLocalStorage(NO_DRAG_CLICKS_KEY, 5);
  const [isOpen, setIsOpen] = React.useState(false);

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = usePersistFunction((event) => {
    // if the user clicked on the button without dragging, increment the number of clicks
    if (buttonRef.current?.contains(event.target as Node)) {
      setNoDragClicks(getNoDragClicks() + 1);

      if (getNoDragClicks() > 4) {
        setIsOpen(true);
      }
    }
  });

  const onMouseLeave = usePersistFunction(() => {
    setIsOpen(false);
  });

  const handleDontShowAgain: React.MouseEventHandler = usePersistFunction(() => {
    setIsOpen(false);
    setNoDragClicks(0);
  });

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div ref={popper.setReferenceElement} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}>
      <div ref={buttonRef}>{children({ isOpen })}</div>
      {isOpen && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, paddingLeft: '6px' }} {...popper.attributes.popper}>
            <S.TooltipContainer width={232}>
              <TippyTooltip.FooterButton buttonText="Don't show again" onClick={handleDontShowAgain}>
                Click + drag to add steps to the canvas.
                <Box borderRadius={6} mt={8} as="img" src={addStepGuide} alt="add step" width="100%" />
              </TippyTooltip.FooterButton>
            </S.TooltipContainer>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default StepMenuClickNoDragTooltip;
