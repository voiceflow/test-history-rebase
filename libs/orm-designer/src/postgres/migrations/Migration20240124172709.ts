import { Migration } from '@mikro-orm/migrations';

export class Migration20240124172709 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."variable" drop constraint if exists "variable_system_check";');

    this.addSql('alter table "designer"."variable" alter column "system" type text using ("system"::text);');
    this.addSql(
      "alter table \"designer\".\"variable\" add constraint \"variable_system_check\" check (\"system\" in ('locale', 'channel', 'user_id', 'sessions', 'platform', 'timestamp', 'last_event', 'last_response', 'last_utterance', 'intent_confidence'));"
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."variable" drop constraint if exists "variable_system_check";');

    this.addSql('alter table "designer"."variable" alter column "system" type text using ("system"::text);');
    this.addSql(
      "alter table \"designer\".\"variable\" add constraint \"variable_system_check\" check (\"system\" in ('intent_confidence', 'last_response', 'last_utterance', 'sessions', 'timestamp', 'user_id'));"
    );
  }
}
