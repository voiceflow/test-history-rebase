import { AIMessageRole } from '@voiceflow/dtos';
import { describe, expect, it } from 'vitest';

import { AnthropicRole } from './anthropic-message.constant';
import { formatMessages } from './anthropic-message.util';

describe('llm/anthropic/anthropic-message.util', () => {
  describe('formatMessages', () => {
    it('handles empty conversation', () => {
      expect(formatMessages([])).toEqual([]);
    });

    it('handles single message', () => {
      const message = { role: AIMessageRole.USER, content: 'hello' };
      expect(formatMessages([message])).toEqual([
        {
          role: AnthropicRole.USER,
          content: 'hello',
        },
      ]);
    });

    it('handles multiple messages', () => {
      const messages = [
        { role: AIMessageRole.USER, content: 'hello' },
        { role: AIMessageRole.ASSISTANT, content: 'hi' },
      ];
      expect(formatMessages(messages)).toEqual([
        { role: AnthropicRole.USER, content: 'hello' },
        { role: AnthropicRole.ASSISTANT, content: 'hi' },
      ]);
    });

    it('handles consecutive messages of the same type', () => {
      const messages = [
        { role: AIMessageRole.USER, content: 'hello' },
        { role: AIMessageRole.USER, content: 'world' },
      ];
      expect(formatMessages(messages)).toEqual([{ role: AnthropicRole.USER, content: 'hello\nworld' }]);
    });

    it('does not join consecutive messages of different types', () => {
      const messages = [
        { role: AIMessageRole.USER, content: 'hello' },
        { role: AIMessageRole.ASSISTANT, content: 'hi' },
        { role: AIMessageRole.USER, content: 'world' },
      ];
      expect(formatMessages(messages)).toEqual([
        { role: AnthropicRole.USER, content: 'hello' },
        { role: AnthropicRole.ASSISTANT, content: 'hi' },
        { role: AnthropicRole.USER, content: 'world' },
      ]);
    });

    it('prepends user message if assistant message is first', () => {
      const messages = [
        { role: AIMessageRole.ASSISTANT, content: 'hi' },
        { role: AIMessageRole.USER, content: 'hello' },
      ];
      expect(formatMessages(messages)).toEqual([
        { role: AnthropicRole.USER, content: '.' },
        { role: AnthropicRole.ASSISTANT, content: 'hi' },
        { role: AnthropicRole.USER, content: 'hello' },
      ]);
    });

    it('prepends user message if assistant message is first and there are multiple consecutive messages', () => {
      const messages = [
        { role: AIMessageRole.ASSISTANT, content: 'hi' },
        { role: AIMessageRole.USER, content: 'hello' },
        { role: AIMessageRole.USER, content: 'world' },
      ];
      expect(formatMessages(messages)).toEqual([
        { role: AnthropicRole.USER, content: '.' },
        { role: AnthropicRole.ASSISTANT, content: 'hi' },
        { role: AnthropicRole.USER, content: 'hello\nworld' },
      ]);
    });

    it('converts the SYSTEM role to USER', () => {
      const messages = [
        { role: AIMessageRole.SYSTEM, content: 'hi' },
        { role: AIMessageRole.USER, content: 'hello' },
      ];
      expect(formatMessages(messages)).toEqual([{ role: AnthropicRole.USER, content: 'hi\nhello' }]);
    });
  });
});
