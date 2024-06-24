import { Utils } from '@voiceflow/common';
import { Box, Divider, Section } from '@voiceflow/ui-next';
import React, { Fragment, useMemo } from 'react';

import { AIGenerateResponseVariantButton } from '@/components/AI/AIGenerateResponseVariantButton/AIGenerateResponseVariantButton.component';
import { CMSFormListButtonRemove } from '@/components/CMS/CMSForm/CMSFormListButtonRemove/CMSFormListButtonRemove.component';
import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { isResponseMessageEmpty } from '@/utils/response.util';

import { ResponseMessage } from '../ResponseMessage/ResponseMessage.component';
import type { IResponseMessageForm } from './ResponseMessageForm.interface';

export const ResponseMessageForm: React.FC<IResponseMessageForm> = ({
  rootMessage,
  otherMessages = [],
  aiGenerate: aiGenerateMessage,
  onAddMessage,
  onDeleteMessage,
  onUpdateMessage,
}) => {
  const allMessages = useMemo(() => (rootMessage ? [rootMessage, ...otherMessages] : []), [rootMessage, otherMessages]);

  const autofocus = useInputAutoFocusKey();

  const listEmpty = useIsListEmpty(allMessages, (message) => isResponseMessageEmpty(message));

  const hasMessages = otherMessages.length;

  const handleAddMessage = async () => {
    const newMessage = await onAddMessage();

    if (newMessage) {
      autofocus.setKey(newMessage.id);
    }
  };

  if (!rootMessage) return null;

  return (
    <>
      <Box pt={11} pr={24} pb={18} direction="column">
        <ResponseMessage
          autoFocusIfEmpty={!hasMessages}
          onValueEmpty={listEmpty.container(0)}
          value={rootMessage.text}
          onValueChange={(text) => onUpdateMessage(rootMessage.id, { text })}
          onChangeVariantType={() => null}
        />
      </Box>

      <Divider />

      <Section.Header.Container
        pt={11}
        pb={hasMessages ? 0 : 11}
        variant="active"
        title={(className) => (
          <SectionHeaderTitleWithLearnTooltip
            title="Messages"
            className={className}
            onLearnClick={Utils.functional.noop}
          >
            <Box gap={8} direction="column">
              <span>Message responses will be selected randomly when you run your agent.</span>
              {/* TODO: uncomment when conditions are supported */}
              {/* <span>
                          If you add a condition to a message, it will become a ‘conditional response’. This means if
                          the attached condition is true, the agent will delivery that specific message.
                        </span> */}
            </Box>
          </SectionHeaderTitleWithLearnTooltip>
        )}
      >
        {!hasMessages && (
          <Section.Header.Button
            onClick={() => aiGenerateMessage.onGenerate({ quantity: 3 })}
            iconName="Generate"
            disabled={aiGenerateMessage.isFetching}
            isLoading={aiGenerateMessage.isFetching}
          />
        )}

        <Section.Header.Button iconName="Plus" onClick={handleAddMessage} disabled={aiGenerateMessage.isFetching} />
      </Section.Header.Container>

      {!hasMessages ? (
        <Divider />
      ) : (
        <>
          {otherMessages.map((message, index) => (
            <Fragment key={message.id}>
              <Box pt={index === 0 ? 0 : 12} pb={20} pr={24} direction="column">
                <ResponseMessage
                  autoFocus={autofocus.key === message.id}
                  onValueEmpty={listEmpty.container(index + 1)}
                  removeButton={<CMSFormListButtonRemove onClick={() => onDeleteMessage(message.id)} />}
                  autoFocusIfEmpty={!hasMessages}
                  value={message.text}
                  onValueChange={(text) => onUpdateMessage(message.id, { text })}
                  onChangeVariantType={() => null}
                />
              </Box>

              {otherMessages.length !== index + 1 && <Divider />}
            </Fragment>
          ))}

          {aiGenerateMessage.isEnabled && (
            <Box px={16} pb={16}>
              <AIGenerateResponseVariantButton
                isLoading={aiGenerateMessage.isFetching}
                onGenerate={aiGenerateMessage.onGenerate}
                hasExtraContext={!listEmpty.value}
              />
            </Box>
          )}

          <Divider />
        </>
      )}
    </>
  );
};
