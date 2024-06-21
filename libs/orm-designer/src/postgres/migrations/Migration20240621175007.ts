import { Migration } from '@mikro-orm/migrations';

export class Migration20240621175007 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."persona_override" drop constraint if exists "persona_override_model_check";');

    this.addSql(
      'alter table "designer"."response" add column "type" text check ("type" in (\'prompt\', \'message\')) null default \'message\', add column "draft" boolean null default false;'
    );

    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona\" add constraint \"persona_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'claude-v1', 'claude-v2', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3.5-sonnet', 'claude-3-opus', 'claude-instant-v1', 'gemini-pro-1.5', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."persona_override" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona_override\" add constraint \"persona_override_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'claude-v1', 'claude-v2', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3.5-sonnet', 'claude-3-opus', 'claude-instant-v1', 'gemini-pro-1.5', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."response_message" add column "delay" int null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."persona_override" drop constraint if exists "persona_override_model_check";');

    this.addSql('alter table "designer"."response" drop column "type";');
    this.addSql('alter table "designer"."response" drop column "draft";');

    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona\" add constraint \"persona_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'claude-v1', 'claude-v2', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus', 'claude-instant-v1', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."persona_override" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona_override\" add constraint \"persona_override_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'claude-v1', 'claude-v2', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus', 'claude-instant-v1', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."response_message" drop column "delay";');
  }
}
