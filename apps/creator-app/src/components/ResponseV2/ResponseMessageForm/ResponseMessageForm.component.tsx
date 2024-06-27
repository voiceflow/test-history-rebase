import { Utils } from '@voiceflow/common';
import type { ResponseMessage } from '@voiceflow/dtos';
import { Box, Divider, Section, SortableList } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { AIGenerateResponseVariantButton } from '@/components/AI/AIGenerateResponseVariantButton/AIGenerateResponseVariantButton.component';
import { CMSFormListButtonRemove } from '@/components/CMS/CMSForm/CMSFormListButtonRemove/CMSFormListButtonRemove.component';
import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { isResponseMessageEmpty } from '@/utils/response.util';

// import { MessageCondition } from '../MessageCondition/MessageCondition.component';
import { ResponseMessage as ResponseMessageInput } from '../ResponseMessage/ResponseMessage.component';
import type { IResponseMessageForm } from './ResponseMessageForm.interface';

export const ResponseMessageForm: React.FC<IResponseMessageForm> = ({
  rootMessage,
  otherMessages = [],
  aiGenerate: aiGenerateMessage,
  onAddMessage,
  onDeleteMessage,
  onUpdateMessage,
  onReorderMessages,
}) => {
  const allMessages = useMemo(() => (rootMessage ? [rootMessage, ...otherMessages] : []), [rootMessage, otherMessages]);

  const autofocus = useInputAutoFocusKey();

  const listEmpty = useIsListEmpty(allMessages, (message) => isResponseMessageEmpty(message));

  const hasMessages = !!otherMessages.length;

  const handleAddMessage = async () => {
    const newMessage = await onAddMessage();

    if (newMessage) {
      autofocus.setKey(newMessage.id);
    }
  };

  if (!rootMessage) return null;

  return (
    <>
      <Box pt={11} pr={24} pb={15} direction="column">
        <ResponseMessageInput
          onValueChange={(text) => onUpdateMessage(rootMessage.id, { text })}
          onValueEmpty={listEmpty.container(0)}
          onChangeVariantType={() => null}
          autoFocusIfEmpty={!hasMessages}
          value={rootMessage.text}
        />
      </Box>

      <Divider />

      <Section.Header.Container
        pt={7}
        pb={hasMessages ? 0 : 7}
        variant={hasMessages ? 'active' : 'basic'}
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
        {!hasMessages && !listEmpty.value && (
          <Section.Header.Button
            onClick={() => aiGenerateMessage.onGenerate({ quantity: 3 })}
            isLoading={aiGenerateMessage.isFetching}
            disabled={aiGenerateMessage.isFetching}
            iconName="Generate"
          />
        )}

        <Section.Header.Button iconName="Plus" onClick={handleAddMessage} disabled={aiGenerateMessage.isFetching} />
      </Section.Header.Container>

      {!hasMessages && <Divider />}

      <SortableList
        items={otherMessages}
        getItemKey={(path) => path.id}
        onItemsReorder={(item: ResponseMessage[]) => onReorderMessages([rootMessage.id, ...item.map((a) => a.id)])}
        renderItem={({ ref, item, dragContainerProps }) => {
          const index = otherMessages.findIndex((message) => message.id === item.id);
          const isFirst = index === 0;

          return (
            <div key={item.id} ref={ref} {...dragContainerProps}>
              {!isFirst && <Divider fullWidth={false} />}

              <Box pt={!isFirst ? 12 : 0} pb={12} pr={28} direction="column">
                <ResponseMessageInput
                  removeButton={<CMSFormListButtonRemove onClick={() => onDeleteMessage(item.id)} />}
                  onValueChange={(text) => onUpdateMessage(item.id, { text })}
                  onValueEmpty={listEmpty.container(index)}
                  autoFocus={autofocus.key === item.id}
                  onChangeVariantType={() => null}
                  autoFocusIfEmpty={!hasMessages}
                  value={item.text}
                  canDrag
                />

                {/* <MessageCondition /> */}
              </Box>
            </div>
          );
        }}
      />

      {hasMessages && aiGenerateMessage.isEnabled && (
        <>
          <Box px={16} pt={8} pb={10}>
            <AIGenerateResponseVariantButton
              isLoading={aiGenerateMessage.isFetching}
              onGenerate={aiGenerateMessage.onGenerate}
              hasExtraContext={!listEmpty.value}
            />
          </Box>

          <Divider />
        </>
      )}
    </>
  );
};
