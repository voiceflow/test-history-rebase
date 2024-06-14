import { Utils } from '@voiceflow/common';
import { Box, Divider, Section } from '@voiceflow/ui-next';
import React, { Fragment } from 'react';

import { AIGenerateResponseVariantButton } from '@/components/AI/AIGenerateResponseVariantButton/AIGenerateResponseVariantButton.component';
import { useAIGenerateResponseMessages } from '@/components/AI/hooks/ai-generate-response-messages.hook';
import { CMSFormListButtonRemove } from '@/components/CMS/CMSForm/CMSFormListButtonRemove/CMSFormListButtonRemove.component';
import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { Designer } from '@/ducks';
import { useIsAIFeaturesEnabled } from '@/hooks/ai.hook';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { useDispatch } from '@/hooks/store.hook';
import { isResponseMessageEmpty } from '@/utils/response.util';

import { ResponseEditMessage } from '../ResponseEditMessage/ResponseEditMessage.component';
import { useResponseMessages } from './ResponseEditForm.hook';
import type { IResponseEditForm } from './ResponseEditForm.interface';
import { ResponseEditFormSectionGenerateButton } from './ResponseEditFormSectionGenerateButton/ResponseEditFormSectionGenerateButton.component';

export const ResponseEditForm: React.FC<IResponseEditForm> = ({ responseID }) => {
  const deleteMessage = useDispatch(Designer.Response.ResponseMessage.effect.deleteOne);
  const createMessage = useDispatch(Designer.Response.ResponseMessage.effect.createOne);
  const createManyTextMessages = useDispatch(Designer.Response.ResponseMessage.effect.createMany);

  const autofocus = useInputAutoFocusKey();
  const aiFeaturesEnabled = useIsAIFeaturesEnabled();
  const { messages, discriminatorID } = useResponseMessages({ responseID });

  const aiGenerateMessage = useAIGenerateResponseMessages({
    examples: messages,
    onGenerated: (newMessages) => discriminatorID && createManyTextMessages(discriminatorID, newMessages),
    successGeneratedMessage: 'Messages generated',
  });

  const listEmpty = useIsListEmpty(messages, (message) => isResponseMessageEmpty(message));

  if (!messages.length || discriminatorID === null) return null;

  const [rootMessage, ...otherMessages] = messages;

  const onAddMessage = async () => {
    const res = await createMessage(discriminatorID);

    autofocus.setKey(res.id);
  };

  const hasMessages = otherMessages.length > 0;

  return (
    <>
      <Box pt={11} pr={24} pb={18} direction="column">
        <ResponseEditMessage
          responseMessage={rootMessage}
          autoFocusIfEmpty={!hasMessages}
          onValueEmpty={listEmpty.container(0)}
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
          <ResponseEditFormSectionGenerateButton
            onClick={() => aiGenerateMessage.onGenerate({ quantity: 3 })}
            loading={aiGenerateMessage.fetching}
          />
        )}

        <Section.Header.Button iconName="Plus" onClick={onAddMessage} disabled={aiGenerateMessage.fetching} />
      </Section.Header.Container>

      {!hasMessages ? (
        <Divider />
      ) : (
        <>
          {otherMessages.map((message, index) => (
            <Fragment key={message.id}>
              <Box pt={index === 0 ? 0 : 12} pb={20} pr={24} direction="column">
                <ResponseEditMessage
                  responseMessage={message}
                  autoFocus={autofocus.key === message.id}
                  onValueEmpty={listEmpty.container(index + 1)}
                  removeButton={<CMSFormListButtonRemove onClick={() => deleteMessage(message.id)} />}
                />
              </Box>

              {otherMessages.length !== index + 1 && <Divider />}
            </Fragment>
          ))}

          {aiFeaturesEnabled && (
            <Box px={16} pb={16}>
              <AIGenerateResponseVariantButton
                isLoading={aiGenerateMessage.fetching}
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
