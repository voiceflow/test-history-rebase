import composeRef from '@seznam/compose-react-refs';
import { Button, Modal, TippyTooltip, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useAutoScrollNodeIntoView, useDispatch, useSelector, useTrackingEvents } from '@/hooks';

import manager from '../../manager';
import { Disclaimer } from './components';

const FreestyleFeatureDisclaimer = manager.create('FreestyleFeatureDisclaimer', () => ({ api, type, opened, hidden, animated }) => {
  const [trackingEvents] = useTrackingEvents();
  const disclaimerEndRef = React.useRef<HTMLDivElement>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = React.useState(false);
  const [ref, scrollSectionIntoView] = useAutoScrollNodeIntoView<HTMLDivElement>({ options: { block: 'end' } });
  const isScrolledToEnd = useOnScreen(disclaimerEndRef);
  const activeProjectID = useSelector(Session.activeProjectIDSelector);
  const aiAssistSettings = useSelector(ProjectV2.active.aiAssistSettings);
  const updateProjectAiAssistSettings = useDispatch(Project.updateProjectAiAssistSettings);
  const sendNotificationEmail = useDispatch(ProjectV2.sendFreestyleDisclaimerEmail);

  const onAccept = () => {
    if (!activeProjectID) return;
    updateProjectAiAssistSettings(activeProjectID, { ...aiAssistSettings, freestyle: true });
    sendNotificationEmail();
    trackingEvents.trackFreestyleDisclaimerAccepted();
    api.close();
  };

  React.useEffect(() => {
    if (!hasScrolledToEnd && isScrolledToEnd) setHasScrolledToEnd(true);
  }, [isScrolledToEnd]);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={500} verticalMargin={32}>
      <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={() => api.close()} />}>
        Freestyle Feature Disclaimer
      </Modal.Header>

      <Disclaimer endNodeRef={composeRef(ref, disclaimerEndRef)} onScrollToEnd={scrollSectionIntoView} isScrolledToEnd={isScrolledToEnd} />

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => api.close()} squareRadius>
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

export default FreestyleFeatureDisclaimer;
