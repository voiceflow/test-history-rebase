import type { GenerateContentRequest } from '@google-cloud/vertexai';
import type { AIMessage, AIParams } from '@voiceflow/dtos';
import { AIMessageRole } from '@voiceflow/dtos';

export const formatRequest = (messages: AIMessage[], params: AIParams): GenerateContentRequest => {
  const googleMessages = messages.reduce<{ role: AIMessageRole; content: string }[]>((acc, message) => {
    const previous = acc[acc.length - 1];

    if (previous && previous.role === message.role) {
      previous.content += `\n${message.content}`;
    } else {
      acc.push({ role: message.role, content: message.content });
    }

    return acc;
  }, []);

  // Insert artificial user input if the first message is from the assistant as Google requires the first message to be from the user
  if (googleMessages[0]?.role === AIMessageRole.ASSISTANT) {
    googleMessages.unshift({ role: AIMessageRole.USER, content: '.' });
  }

  return {
    contents: googleMessages.map((item) => ({
      role: item.role,
      parts: [{ text: item.content }],
    })),
    systemInstruction: params.system || undefined,
  };
};
