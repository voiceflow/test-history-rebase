import { Dropdown, IconButton, IconButtonVariant, stopPropagation } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import { TranscriptExportFormat } from '@/client/transcript';
import { Permission } from '@/config/permissions';
import * as Modal from '@/ducks/modal';
import * as Router from '@/ducks/router';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, usePermission, useTrackingEvents } from '@/hooks';
import { SystemTag, Transcript as TranscriptModel } from '@/models';
import { ClassName } from '@/styles/constants';
import { isSentimentTag } from '@/utils/reportTag';

import { Container, InfoSection, ReadStatusDot, StatusIcons } from './components';

interface ResultsItem {
  data: TranscriptModel;
  format: TranscriptExportFormat;
  active?: boolean;
  isLastItem?: boolean;
}

const TranscriptResultsItem: React.FC<ResultsItem> = ({ data, format, active = false, isLastItem = false }) => {
  const { id, reportTags, unread, createdAt, name } = data;

  const [trackingEvents] = useTrackingEvents();
  const [canDeleteTranscript] = usePermission(Permission.DELETE_TRANSCRIPT);

  const allTranscripts = useSelector(Transcript.allTranscriptsSelector);

  const markAsRead = useDispatch(Transcript.markAsRead);
  const confirmDelete = useDispatch(Modal.setConfirm);
  const deleteTranscript = useDispatch(Transcript.deleteTranscript);
  const exportTranscript = useDispatch(Transcript.exportTranscript);
  const goToTargetTranscript = useDispatch(Router.goToTargetTranscript);

  const goToTarget = () => {
    goToTargetTranscript(id);
  };

  const onDelete = () => {
    confirmDelete({
      body: 'Are you sure you want to delete this conversation?',
      bodyStyle: { padding: '16px', textAlign: 'center' },
      modalProps: { centered: true, withHeader: false, maxWidth: 300 },
      footerStyle: { justifyContent: 'space-between' },

      confirm: () => {
        deleteTranscript(id);
        trackingEvents.trackConversationDeleted();
        if (allTranscripts.length) goToTargetTranscript(allTranscripts[0].id);
      },
    });
  };

  const onExport = async () => {
    await exportTranscript(format, id, name);

    trackingEvents.trackConversationExported();
  };

  const [sentiment, isSaved, isReviewed] = React.useMemo(
    () => [reportTags.find(isSentimentTag), reportTags.includes(SystemTag.SAVED), reportTags.includes(SystemTag.REVIEWED)] as const,
    [reportTags]
  );

  React.useEffect(() => {
    if (active && unread) {
      markAsRead(id);
    }
  }, [active]);

  return (
    <Dropdown
      options={[
        { value: 'export', label: 'Export', onClick: onExport },
        ...(canDeleteTranscript ? [{ value: 'delete', label: 'Delete', onClick: onDelete }] : []),
      ]}
    >
      {(ref, onToggle, isOpen) => (
        <Container
          id={id}
          active={active}
          onClick={goToTarget}
          menuOpen={isOpen}
          className={cn(ClassName.TRANSCRIPT_ITEM, { active })}
          isLastItem={isLastItem}
        >
          <ReadStatusDot read={!unread} />

          <InfoSection active={active} name={name} date={createdAt} isRead={!unread} tags={reportTags} />

          <div className={ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON}>
            <IconButton icon="ellipsis" variant={IconButtonVariant.SUBTLE} size={15} onClick={stopPropagation(onToggle)} ref={ref} />
          </div>

          {!isOpen && <StatusIcons id={id} reviewed={isReviewed} saved={isSaved} sentiment={sentiment} />}
        </Container>
      )}
    </Dropdown>
  );
};

export default TranscriptResultsItem;
