import { Migration } from '@mikro-orm/migrations';

export class Migration20240306162654 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."persona_override" drop constraint if exists "persona_override_model_check";');

    this.addSql('alter table "designer"."story" drop constraint if exists "story_status_check";');

    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona\" add constraint \"persona_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-v1', 'claude-v2', 'claude-instant-v1', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."persona_override" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona_override\" add constraint \"persona_override_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-v1', 'claude-v2', 'claude-instant-v1', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."story" alter column "status" type text using ("status"::text);');
    this.addSql(
      'alter table "designer"."story" add constraint "story_status_check" check ("status" in (\'to_do\', \'complete\', \'in_progress\'));'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."persona_override" drop constraint if exists "persona_override_model_check";');

    this.addSql('alter table "designer"."story" drop constraint if exists "story_status_check";');

    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_model_check" check ("model" in (\'gpt_3\', \'gpt_3.5\', \'gpt_4\'));'
    );

    this.addSql('alter table "designer"."persona_override" alter column "model" type text using ("model"::text);');
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_model_check" check ("model" in (\'gpt_3\', \'gpt_3.5\', \'gpt_4\'));'
    );

    this.addSql('alter table "designer"."story" alter column "status" type text using ("status"::text);');
    this.addSql(
      'alter table "designer"."story" add constraint "story_status_check" check ("status" in (\'to_do\', \'in_progress\', \'complete\'));'
    );
  }
}
