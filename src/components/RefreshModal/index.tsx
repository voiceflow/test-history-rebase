import React from 'react';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Modal, { ModalFooter } from '@/components/Modal';
import { IS_DEVELOPMENT } from '@/config';
import { ModalType } from '@/constants';
import { styled } from '@/hocs';
import { useModals, useSetup } from '@/hooks';
import { BodyContainer, ContentContainer } from '@/pages/Dashboard/components/ModalComponents';

const StyledModal = styled(Modal)`
  max-width: 392px;
`;

const INTERVAL = 600000; // 10 mins

const RefreshModal: React.FC = () => {
  const pageCache = React.useRef<string>();
  const { open } = useModals(ModalType.REFRESH);

  const fetchPage = React.useCallback(async () => {
    // eslint-disable-next-line compat/compat
    const res = await fetch('/');

    return res.text();
  }, []);

  useSetup(async () => {
    if (IS_DEVELOPMENT) {
      return;
    }

    pageCache.current = await fetchPage();

    setInterval(async () => {
      const nextPage = await fetchPage();

      if (nextPage !== pageCache.current) {
        open();
        pageCache.current = nextPage;

        // to speedup refresh
        window.document.head.insertAdjacentHTML('beforeend', `<link rel="prerender" href="${window.location.href}" />`);
      }
    }, INTERVAL);
  });

  return (
    <StyledModal id={ModalType.REFRESH} title="New Version" isSmall>
      <Box width="100%">
        <BodyContainer column>
          <img src="/images/takeoff.svg" alt="new version" height={80} />

          <ContentContainer>Voiceflow has published new changes. Please refresh to gain access to the newest version. </ContentContainer>
        </BodyContainer>

        <ModalFooter justifyContent="flex-end">
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </ModalFooter>
      </Box>
    </StyledModal>
  );
};

export default RefreshModal;
