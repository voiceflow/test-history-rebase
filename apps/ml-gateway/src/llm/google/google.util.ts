import type { GenerateContentRequest } from '@google-cloud/vertexai';
import type { AIMessage, AIParams } from '@voiceflow/dtos';
import { AIMessageRole } from '@voiceflow/dtos';

export const formatRequest = (messages: AIMessage[], params: AIParams): GenerateContentRequest => {
  return {
    contents: messages.map((item, index) => ({
      role: index === 0 && item.role === AIMessageRole.ASSISTANT ? AIMessageRole.USER : item.role,
      parts: [{ text: item.content }],
    })),
    systemInstruction: params.system || undefined,
  };
};
