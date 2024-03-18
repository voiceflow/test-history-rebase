import type { AIMessage } from '@voiceflow/dtos';

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
