import { Migration } from '@mikro-orm/migrations';

export class Migration20240130101907 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."variable" add column "is_system" boolean not null default false;');
    this.addSql('alter table "designer"."variable" drop column "system";');
  }

  async down(): Promise<void> {
    this.addSql(
      "alter table \"designer\".\"variable\" add column \"system\" text check (\"system\" in ('locale', 'channel', 'user_id', 'sessions', 'platform', 'timestamp', 'last_event', 'last_response', 'last_utterance', 'intent_confidence')) null default null;"
    );
    this.addSql('alter table "designer"."variable" drop column "is_system";');
  }
}
