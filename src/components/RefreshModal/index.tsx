import React from 'react';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Modal, { ModalFooter } from '@/components/Modal';
import { Link } from '@/components/Text';
import { IS_DEVELOPMENT } from '@/config';
import { ModalType } from '@/constants';
import { styled } from '@/hocs';
import { useModals, useScheduled, useSetup } from '@/hooks';
import { BodyContainer, ContentContainer } from '@/pages/Dashboard/components/ModalComponents';
import Logger from '@/utils/logger';

const log = Logger.child('refreshModal');

const StyledModal = styled(Modal)`
  max-width: 392px;
`;

// eslint-disable-next-line no-secrets/no-secrets
const CHANGELOG_LINK = 'https://www.notion.so/voiceflow/Voiceflow-Changelog-b5e32e269b204106b5b51014cd049346';

const RefreshModal: React.FC = () => {
  const pageCache = React.useRef<string>();
  const { open } = useModals(ModalType.REFRESH);

  const fetchPage = React.useCallback(async () => {
    const res = await fetch('/');

    return res.text();
  }, []);

  useSetup(async () => {
    if (IS_DEVELOPMENT) {
      return;
    }

    pageCache.current = await fetchPage();
  });

  useScheduled(['8pm', '8am'], async () => {
    if (!pageCache.current) return;

    log.info(log.pending('checking for new releases'));

    const nextPage = await fetchPage();

    if (nextPage !== pageCache.current) {
      pageCache.current = nextPage;

      log.info(log.success('new release found!'));
      open();

      // to speedup refresh
      window.document.head.insertAdjacentHTML('beforeend', `<link rel="prerender" href="${window.location.href}" />`);
    }
  });

  return (
    <StyledModal id={ModalType.REFRESH} title="New Version" isSmall>
      <Box width="100%">
        <BodyContainer column>
          <img src="/images/takeoff.svg" alt="new version" height={80} />

          <ContentContainer>Voiceflow has published new changes. Please refresh to gain access to the newest version. </ContentContainer>
        </BodyContainer>

        <ModalFooter justifyContent="space-between">
          <Link href={CHANGELOG_LINK}>See what’s new!</Link>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </ModalFooter>
      </Box>
    </StyledModal>
  );
};

export default RefreshModal;
