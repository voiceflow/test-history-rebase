import type Client from '@anthropic-ai/sdk';
import type { AIMessage } from '@voiceflow/dtos';
import { match } from 'ts-pattern';

import type { CompletionStreamOutput } from '../llm-model.dto';
import { AnthropicRole, AnthropicRoleMap } from './anthropic-message.constant';

export const formatMessages = (messages: AIMessage[]) => {
  // join any consecutive messages of the same type together
  const anthropicMessages = messages.reduce<{ role: AnthropicRole; content: string }[]>((acc, message) => {
    const previous = acc[acc.length - 1];

    if (previous && previous.role === message.role) {
      previous.content += `\n${message.content}`;
    } else {
      acc.push({ role: AnthropicRoleMap[message.role], content: message.content });
    }

    return acc;
  }, []);

  // anthropic expects the first message to be from the user
  if (anthropicMessages[0]?.role === AnthropicRole.ASSISTANT) {
    anthropicMessages.unshift({ role: AnthropicRole.USER, content: '.' });
  }

  return anthropicMessages;
};

export const messageEventToCompletion = (config: { model: string; multiplier: number }) => (chunk: Client.Messages.MessageStreamEvent) =>
  match<Client.Messages.MessageStreamEvent, CompletionStreamOutput | null>(chunk)
    .when(
      (chunk): chunk is Client.Messages.ContentBlockDeltaEvent => chunk.type === 'content_block_delta',
      (chunk) => {
        return {
          type: 'completion',
          completion: {
            output: chunk.delta.text,
            tokens: 0,
            queryTokens: 0,
            answerTokens: 0,
            model: config.model,
            multiplier: config.multiplier,
          },
        };
      }
    )
    .when(
      (chunk): chunk is Client.Messages.ContentBlockStartEvent => chunk.type === 'content_block_start',
      (chunk) => {
        return {
          type: 'completion',
          completion: {
            output: chunk.content_block.text,
            tokens: 0,
            queryTokens: 0,
            answerTokens: 0,
            model: config.model,
            multiplier: config.multiplier,
          },
        };
      }
    )
    .when(
      (chunk): chunk is Client.Messages.ContentBlockStopEvent => chunk.type === 'content_block_stop',
      () => {
        return null;
      }
    )
    .when(
      (chunk): chunk is Client.Messages.MessageDeltaEvent => chunk.type === 'message_delta',
      (chunk) => {
        const queryTokens = 0;
        const answerTokens = chunk.usage.output_tokens || 0;

        return {
          type: 'completion',
          completion: {
            output: '',
            tokens: queryTokens + answerTokens,
            queryTokens,
            answerTokens,
            model: config.model,
            multiplier: config.multiplier,
          },
        };
      }
    )
    .when(
      (chunk): chunk is Client.Messages.MessageStartEvent => chunk.type === 'message_start',
      (chunk) => {
        const output = chunk.message.content?.map((content) => content.text).join('\n') || null;

        const queryTokens = chunk.message.usage.input_tokens || 0;
        const answerTokens = chunk.message.usage.output_tokens || 0;

        return {
          type: 'completion',
          completion: {
            output,
            tokens: queryTokens + answerTokens,
            queryTokens,
            answerTokens,
            model: config.model,
            multiplier: config.multiplier,
          },
        };
      }
    )
    .when(
      (chunk): chunk is Client.Messages.MessageStopEvent => chunk.type === 'message_stop',
      () => {
        return null;
      }
    )
    .exhaustive();
