import React from 'react';

import ReportTagInput from '@/components/ReportTagInput';
import { ClickableText } from '@/components/Text';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { Container, SectionTitle } from '../components';

const Notes = () => {
  const { open: openTagManager } = useModals(ModalType.TAG_MANAGER);
  const [tags, setTags] = React.useState<string[]>([]);

  return (
    <Container withBackground>
      <SectionTitle>
        TAGS
        <ClickableText onClick={openTagManager}>Manager</ClickableText>
      </SectionTitle>
      <ReportTagInput selectedTags={tags} onChange={(value: string[]) => setTags(value)} />
    </Container>
  );
};

export default Notes;
