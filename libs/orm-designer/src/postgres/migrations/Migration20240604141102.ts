import { Migration } from '@mikro-orm/migrations';

export class Migration20240604141102 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_prompt_id_environment_id_foreign";');

    this.addSql('drop table if exists "designer"."prompt" cascade;');

    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."persona_override" drop constraint if exists "persona_override_model_check";');

    this.addSql('alter table "designer"."response_variant" drop constraint if exists "response_variant_type_check";');

    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql('alter table "designer"."persona" add constraint "persona_model_check" check ("model" in (\'text-davinci-003\', \'gpt-3.5-turbo-1106\', \'gpt-3.5-turbo\', \'gpt-4\', \'gpt-4-turbo\', \'gpt-4o\', \'claude-v1\', \'claude-v2\', \'claude-3-haiku\', \'claude-3-sonnet\', \'claude-3-opus\', \'claude-instant-v1\', \'gemini-pro\'));');

    this.addSql('alter table "designer"."persona_override" alter column "model" type text using ("model"::text);');
    this.addSql('alter table "designer"."persona_override" add constraint "persona_override_model_check" check ("model" in (\'text-davinci-003\', \'gpt-3.5-turbo-1106\', \'gpt-3.5-turbo\', \'gpt-4\', \'gpt-4-turbo\', \'gpt-4o\', \'claude-v1\', \'claude-v2\', \'claude-3-haiku\', \'claude-3-sonnet\', \'claude-3-opus\', \'claude-instant-v1\', \'gemini-pro\'));');

    this.addSql('alter table "designer"."response_variant" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "designer"."response_variant" add constraint "response_variant_type_check" check ("type" in (\'prompt\', \'text\'));');
  }

  async down(): Promise<void> {
    this.addSql('create table "designer"."prompt" ("id" varchar(24) not null, "environment_id" varchar(24) not null default null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "updated_by_id" int not null, "name" varchar(255) not null, "assistant_id" varchar(24) not null, "created_by_id" int not null, "folder_id" varchar(24) null default null, "text" jsonb not null, "persona_id" varchar(24) null default null, constraint "prompt_pkey" primary key ("id", "environment_id"));');
    this.addSql('alter table "designer"."prompt" add constraint "prompt_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('alter table "designer"."prompt" add constraint "prompt_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;');
    this.addSql('alter table "designer"."prompt" add constraint "prompt_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "designer"."prompt" add constraint "prompt_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;');
    this.addSql('alter table "designer"."prompt" add constraint "prompt_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;');
    this.addSql('alter table "designer"."prompt" add constraint "prompt_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona_override" ("id", "environment_id") on update cascade on delete set default;');

    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."persona_override" drop constraint if exists "persona_override_model_check";');

    this.addSql('alter table "designer"."response_variant" drop constraint if exists "response_variant_type_check";');

    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql('alter table "designer"."persona" add constraint "persona_model_check" check ("model" in (\'text-davinci-003\', \'gpt-3.5-turbo-1106\', \'gpt-3.5-turbo\', \'gpt-4\', \'gpt-4-turbo\', \'claude-v1\', \'claude-v2\', \'claude-3-haiku\', \'claude-3-sonnet\', \'claude-3-opus\', \'claude-instant-v1\', \'gemini-pro\'));');

    this.addSql('alter table "designer"."persona_override" alter column "model" type text using ("model"::text);');
    this.addSql('alter table "designer"."persona_override" add constraint "persona_override_model_check" check ("model" in (\'text-davinci-003\', \'gpt-3.5-turbo-1106\', \'gpt-3.5-turbo\', \'gpt-4\', \'gpt-4-turbo\', \'claude-v1\', \'claude-v2\', \'claude-3-haiku\', \'claude-3-sonnet\', \'claude-3-opus\', \'claude-instant-v1\', \'gemini-pro\'));');

    this.addSql('alter table "designer"."response_variant" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "designer"."response_variant" add constraint "response_variant_type_check" check ("type" in (\'json\', \'prompt\', \'text\'));');
    this.addSql('alter table "designer"."response_variant" add constraint "response_variant_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set default;');
  }

}
