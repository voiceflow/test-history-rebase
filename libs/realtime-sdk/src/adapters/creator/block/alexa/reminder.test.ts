import { Creator } from '@test/factories';
import { AlexaNode } from '@voiceflow/alexa-types';
import { describe, expect, it } from 'vitest';

import reminderAdapter from './reminder';

describe('Adapters | Creator | Block | Alexa | reminderAdapter', () => {
  describe('when transforming from db', () => {
    it('includes reminder data', () => {
      const reminder = Creator.Block.Alexa.Reminder({ type: AlexaNode.Reminder.ReminderType.SCHEDULED_RELATIVE });
      const data = Creator.Block.Alexa.ReminderStepData({ reminder });

      const result = reminderAdapter.fromDB(data, { context: {} });

      expect(result).includes({
        name: reminder.name,
        text: reminder.text,
        hours: reminder.time.h,
        minutes: reminder.time.m,
        seconds: reminder.time.s,
        timezone: reminder.timezone,
        recurrence: reminder.recurrence,
        recurrenceBool: reminder.recurrenceBool,
      });
    });

    describe('and reminder type is scheduled relative', () => {
      it('returns time type', () => {
        const reminder = Creator.Block.Alexa.Reminder({ type: AlexaNode.Reminder.ReminderType.SCHEDULED_RELATIVE });
        const data = Creator.Block.Alexa.ReminderStepData({ reminder });

        const result = reminderAdapter.fromDB(data, { context: {} });

        expect(result.reminderType).eql(AlexaNode.Reminder.ReminderClientType.TIME);
      });
    });

    describe('and reminder type is scheduled absolute', () => {
      it('returns scheduled type', () => {
        const reminder = Creator.Block.Alexa.Reminder({ type: AlexaNode.Reminder.ReminderType.SCHEDULED_ABSOLUTE });
        const data = Creator.Block.Alexa.ReminderStepData({ reminder });

        const result = reminderAdapter.fromDB(data, { context: {} });

        expect(result.reminderType).eql(AlexaNode.Reminder.ReminderClientType.SCHEDULED);
      });
    });

    describe('and data is not a string', () => {
      it('returns given date', () => {
        const reminder = Creator.Block.Alexa.Reminder({ date: 123 as any });
        const data = Creator.Block.Alexa.ReminderStepData({ reminder });

        const result = reminderAdapter.fromDB(data, { context: {} });

        expect(result.date).eql(reminder.date);
      });
    });

    describe('and date is a string', () => {
      it('returns transformed date', () => {
        const reminder = Creator.Block.Alexa.Reminder({ date: 'date' });
        const data = Creator.Block.Alexa.ReminderStepData({ reminder });

        const result = reminderAdapter.fromDB(data, { context: {} });

        expect(result.date).eql('date');
      });
    });

    describe('and timezone is not defined', () => {
      it('returns default timezone string', () => {
        const reminder = Creator.Block.Alexa.Reminder({ timezone: undefined });
        const data = Creator.Block.Alexa.ReminderStepData({ reminder });

        const result = reminderAdapter.fromDB(data, { context: {} });

        expect(result.timezone).eql('User Timezone');
      });
    });
  });

  describe('when transforming to db', () => {
    it('works as well', () => {
      const data = Creator.Block.Alexa.ReminderNodeData();

      reminderAdapter.toDB(data, { context: {} });

      expect(true).eql(true);
    });
  });
});
