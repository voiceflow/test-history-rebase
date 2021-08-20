import { Dropdown } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { TranscriptExportFormat } from '@/client/transcript';
import { Permission } from '@/config/permissions';
import * as Modal from '@/ducks/modal';
import * as Router from '@/ducks/router';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, usePermission, useTrackingEvents } from '@/hooks';
import { Sentiment, SentimentArray, SystemTag } from '@/models';
import { ClassName } from '@/styles/constants';

import { Container, InfoSection, OptionButton, ReadStatusDot, StatusIcons } from './components';

interface ResultsItem {
  active?: boolean;
  isLastItem?: boolean;
  data: any;
  format: TranscriptExportFormat;
}

const TranscriptResultsItem: React.FC<ResultsItem> = ({ data, format, active = false, isLastItem = false }) => {
  const { id, reportTags, unread, createdAt, name } = data;
  const isSaved = reportTags.includes(SystemTag.SAVED);
  const isReviewed = reportTags.includes(SystemTag.REVIEWED);
  const sentiment = reportTags.filter((tag: string) => SentimentArray.includes(tag as Sentiment))[0];

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [trackingEvents] = useTrackingEvents();
  const [canDeleteTranscript] = usePermission(Permission.DELETE_TRANSCRIPT);
  const goToTargetTranscript = useDispatch(Router.goToTargetTranscript);
  const markAsRead = useDispatch(Transcript.markAsRead);
  const deleteTranscript = useDispatch(Transcript.deleteTranscript);
  const exportTranscript = useDispatch(Transcript.exportTranscript);
  const confirmDelete = useDispatch(Modal.setConfirm);

  React.useEffect(() => {
    if (active && unread) {
      markAsRead(id);
    }
  }, [active]);

  const goToTarget = () => {
    goToTargetTranscript(id);
  };

  const onDelete = () => {
    confirmDelete({
      warning: false,
      text: 'Are you sure you want to delete this conversation?',
      confirm: () => deleteTranscript(id),
    });
    trackingEvents.trackConversationDeleted();
  };
  const onExport = async () => {
    await exportTranscript(format, id, name);
    trackingEvents.trackConversationExported();
  };

  const options = React.useMemo(() => {
    return canDeleteTranscript
      ? [
          {
            value: 'export',
            label: 'Export',
            onClick: onExport,
          },
          {
            value: 'delete',
            label: 'Delete',
            onClick: onDelete,
          },
        ]
      : [
          {
            value: 'export',
            label: 'Export',
            onClick: onExport,
          },
        ];
  }, [canDeleteTranscript, id]);

  return (
    <Container
      id={id}
      menuOpen={menuOpen}
      active={active}
      onClick={goToTarget}
      isLastItem={isLastItem}
      className={cn(ClassName.TRANSCRIPT_ITEM, { active })}
    >
      <ReadStatusDot read={!unread} />
      <InfoSection active={active} name={name} date={createdAt} isRead={!unread} tags={reportTags} />
      <div className={ClassName.TRANSCRIPT_ITEM_DROPDOWN_BUTTON}>
        <Dropdown options={options}>
          {(ref, onToggle, isOpen) => {
            return <OptionButton ref={ref} onToggle={onToggle} isOpen={isOpen} setMenuOpen={setMenuOpen} />;
          }}
        </Dropdown>
      </div>
      {!menuOpen && <StatusIcons id={id} reviewed={isReviewed} saved={isSaved} sentiment={sentiment} />}
    </Container>
  );
};

export default TranscriptResultsItem;
