import composeRef from '@seznam/compose-react-refs';
import { Button, Modal, TippyTooltip, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import { useAutoScrollNodeIntoView } from '@/hooks';

import manager from '../../manager';
import { Disclaimer } from './components';

export interface DisclaimerModalProps {
  title: string;
  body: React.ReactNode;
}

const DisclaimerModal = manager.create<DisclaimerModalProps, boolean>('Disclaimer', () => ({ api, type, opened, hidden, animated, title, body }) => {
  const disclaimerEndRef = React.useRef<HTMLDivElement>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = React.useState(false);
  const [ref, scrollSectionIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ options: { block: 'end' } });
  const isScrolledToEnd = useOnScreen(disclaimerEndRef);

  const onAccept = () => {
    api.resolve(true);
    api.close();
  };

  const onReject = () => {
    api.resolve(false);
    api.close();
  };

  React.useEffect(() => {
    if (!hasScrolledToEnd && isScrolledToEnd) setHasScrolledToEnd(true);
  }, [isScrolledToEnd]);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500} verticalMargin={32}>
      <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={onReject} />}>
        {title}
      </Modal.Header>

      <Disclaimer
        body={body}
        endNodeRef={composeRef(ref, disclaimerEndRef)}
        onScrollToEnd={scrollSectionIntoView}
        isScrolledToEnd={isScrolledToEnd}
      />

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={onReject} squareRadius>
          Decline
        </Button>

        <TippyTooltip
          interactive
          placement="right"
          width={232}
          disabled={hasScrolledToEnd}
          content={
            <TippyTooltip.FooterButton buttonText="Scroll to bottom" onClick={() => scrollSectionIntoView()}>
              You must scroll to the bottom of the modal before accepting.
            </TippyTooltip.FooterButton>
          }
        >
          <Button disabled={!hasScrolledToEnd} onClick={onAccept}>
            Accept
          </Button>
        </TippyTooltip>
      </Modal.Footer>
    </Modal>
  );
});

export default DisclaimerModal;
