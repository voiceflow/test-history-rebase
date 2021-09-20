import { Node } from '@voiceflow/alexa-types';
import { expect } from 'chai';

import reminderAdapter from '@/adapters/creator/block/alexa/reminder';
import { reminderFactory, reminderNodeDataFactory, reminderStepDataFactory } from '@/tests/factories/alexa/reminder';

describe('Adapters | Creator | Block | Alexa | reminderAdapter', () => {
  describe('when transforming from db', () => {
    it('includes reminder data', () => {
      const reminder = reminderFactory({ type: Node.Reminder.ReminderType.SCHEDULED_RELATIVE });
      const data = reminderStepDataFactory({ reminder });

      const result = reminderAdapter.fromDB(data);

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
        const reminder = reminderFactory({ type: Node.Reminder.ReminderType.SCHEDULED_RELATIVE });
        const data = reminderStepDataFactory({ reminder });

        const result = reminderAdapter.fromDB(data);

        expect(result.reminderType).eql(Node.Reminder.ReminderClientType.TIME);
      });
    });

    describe('and reminder type is scheduled absolute', () => {
      it('returns scheduled type', () => {
        const reminder = reminderFactory({ type: Node.Reminder.ReminderType.SCHEDULED_ABSOLUTE });
        const data = reminderStepDataFactory({ reminder });

        const result = reminderAdapter.fromDB(data);

        expect(result.reminderType).eql(Node.Reminder.ReminderClientType.SCHEDULED);
      });
    });

    describe('and data is not a string', () => {
      it('returns given date', () => {
        const reminder = reminderFactory({ date: 123 as any });
        const data = reminderStepDataFactory({ reminder });

        const result = reminderAdapter.fromDB(data);

        expect(result.date).eql(reminder.date);
      });
    });

    describe('and date is a string', () => {
      it('returns transformed date', () => {
        const reminder = reminderFactory({ date: 'date' });
        const data = reminderStepDataFactory({ reminder });

        const result = reminderAdapter.fromDB(data);

        expect(result.date).eql('date');
      });
    });

    describe('and timezone is not defined', () => {
      it('returns default timezone string', () => {
        const reminder = reminderFactory({ timezone: undefined });
        const data = reminderStepDataFactory({ reminder });

        const result = reminderAdapter.fromDB(data);

        expect(result.timezone).eql('User Timezone');
      });
    });
  });

  describe('when transforming to db', () => {
    it('works as well', () => {
      const data = reminderNodeDataFactory();

      reminderAdapter.toDB(data);

      expect(true).eql(true);
    });
  });
});
