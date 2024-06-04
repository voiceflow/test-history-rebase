import { Migration } from '@mikro-orm/migrations';

export class Migration20240530135155 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."persona_override" drop constraint if exists "persona_override_model_check";');

    this.addSql('alter table "designer"."response_variant" drop constraint if exists "response_variant_type_check";');

    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona\" add constraint \"persona_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'claude-v1', 'claude-v2', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus', 'claude-instant-v1', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."persona_override" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona_override\" add constraint \"persona_override_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'claude-v1', 'claude-v2', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus', 'claude-instant-v1', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."intent" add column "automatic_reprompt_settings" jsonb null default null;');

    this.addSql('alter table "designer"."response_variant" alter column "type" type text using ("type"::text);');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_type_check" check ("type" in (\'prompt\', \'text\'));'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."persona_override" drop constraint if exists "persona_override_model_check";');

    this.addSql('alter table "designer"."response_variant" drop constraint if exists "response_variant_type_check";');

    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona\" add constraint \"persona_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-v1', 'claude-v2', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus', 'claude-instant-v1', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."persona_override" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona_override\" add constraint \"persona_override_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-v1', 'claude-v2', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus', 'claude-instant-v1', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."intent" drop column "automatic_reprompt_settings";');

    this.addSql('alter table "designer"."response_variant" alter column "type" type text using ("type"::text);');
    this.addSql(
      'alter table "designer"."response_variant" add constraint "response_variant_type_check" check ("type" in (\'json\', \'prompt\', \'text\'));'
    );
  }
}
