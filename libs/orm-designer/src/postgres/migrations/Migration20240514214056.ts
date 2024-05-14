import { Migration } from '@mikro-orm/migrations';

export class Migration20240514214056 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "designer"."assistant" drop constraint "assistant_active_persona_id_active_environment_id_foreign";');

    this.addSql('alter table "designer"."persona_override" drop constraint "persona_override_persona_id_environment_id_foreign";');

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_persona_id_environment_id_foreign";');

    this.addSql('alter table "designer"."condition" drop constraint "condition_prompt_id_environment_id_foreign";');

    this.addSql('alter table "designer"."response_variant" drop constraint "response_variant_prompt_id_environment_id_foreign";');

    this.addSql('drop table if exists "designer"."persona" cascade;');

    this.addSql('drop table if exists "designer"."persona_override" cascade;');

    this.addSql('drop table if exists "designer"."prompt" cascade;');

    this.addSql('alter table "designer"."assistant" alter column "active_environment_id" type varchar(24) using ("active_environment_id"::varchar(24));');
    this.addSql('alter table "designer"."assistant" alter column "active_environment_id" set not null;');
    this.addSql('alter table "designer"."assistant" drop constraint "assistant_active_persona_id_active_environment_id_unique";');
    this.addSql('alter table "designer"."assistant" drop column "active_persona_id";');

    this.addSql('alter table "designer"."condition" add column "prompt" jsonb null default null;');
    this.addSql('alter table "designer"."condition" drop column "prompt_id";');

    this.addSql('alter table "designer"."response_variant" add column "prompt" jsonb null default null;');
    this.addSql('alter table "designer"."response_variant" drop column "prompt_id";');
  }

  async down(): Promise<void> {
    this.addSql('create table "designer"."persona" ("id" varchar(24) not null, "environment_id" varchar(24) not null default null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "updated_by_id" int not null, "name" varchar(255) not null, "assistant_id" varchar(24) not null, "created_by_id" int not null, "folder_id" varchar(24) null default null, "model" text check ("model" in (\'text-davinci-003\', \'gpt-3.5-turbo-1106\', \'gpt-3.5-turbo\', \'gpt-4\', \'gpt-4-turbo\', \'claude-v1\', \'claude-v2\', \'claude-3-haiku\', \'claude-3-sonnet\', \'claude-3-opus\', \'claude-instant-v1\', \'gemini-pro\')) not null, "max_length" int not null, "temperature" int not null, "system_prompt" text not null, constraint "persona_pkey" primary key ("id", "environment_id"));');
    this.addSql('create index "persona_environment_id_index" on "designer"."persona" ("environment_id");');
    this.addSql('alter table "designer"."persona" add constraint "persona_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('create table "designer"."persona_override" ("id" varchar(24) not null, "environment_id" varchar(24) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "updated_by_id" int null default null, "name" varchar(255) null default null, "model" text check ("model" in (\'text-davinci-003\', \'gpt-3.5-turbo-1106\', \'gpt-3.5-turbo\', \'gpt-4\', \'gpt-4-turbo\', \'claude-v1\', \'claude-v2\', \'claude-3-haiku\', \'claude-3-sonnet\', \'claude-3-opus\', \'claude-instant-v1\', \'gemini-pro\')) null default null, "persona_id" varchar(24) not null, "max_length" int null default null, "assistant_id" varchar(24) not null, "temperature" int null default null, "system_prompt" text null default null, constraint "persona_override_pkey" primary key ("id", "environment_id"));');
    this.addSql('create index "persona_override_environment_id_index" on "designer"."persona_override" ("environment_id");');
    this.addSql('alter table "designer"."persona_override" add constraint "persona_override_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('create table "designer"."prompt" ("id" varchar(24) not null, "environment_id" varchar(24) not null default null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "updated_by_id" int not null, "name" varchar(255) not null, "assistant_id" varchar(24) not null, "created_by_id" int not null, "folder_id" varchar(24) null default null, "text" jsonb not null, "persona_id" varchar(24) null default null, constraint "prompt_pkey" primary key ("id", "environment_id"));');
    this.addSql('alter table "designer"."prompt" add constraint "prompt_id_environment_id_unique" unique ("id", "environment_id");');

    this.addSql('alter table "designer"."persona" add constraint "persona_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;');
    this.addSql('alter table "designer"."persona" add constraint "persona_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "designer"."persona" add constraint "persona_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;');
    this.addSql('alter table "designer"."persona" add constraint "persona_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;');

    this.addSql('alter table "designer"."persona_override" add constraint "persona_override_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "designer"."persona_override" add constraint "persona_override_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona" ("id", "environment_id") on update cascade on delete cascade;');
    this.addSql('alter table "designer"."persona_override" add constraint "persona_override_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "designer"."prompt" add constraint "prompt_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;');
    this.addSql('alter table "designer"."prompt" add constraint "prompt_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "designer"."prompt" add constraint "prompt_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;');
    this.addSql('alter table "designer"."prompt" add constraint "prompt_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;');
    this.addSql('alter table "designer"."prompt" add constraint "prompt_persona_id_environment_id_foreign" foreign key ("persona_id", "environment_id") references "designer"."persona_override" ("id", "environment_id") on update cascade on delete set default;');

    this.addSql('alter table "designer"."assistant" add column "active_persona_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."assistant" alter column "active_environment_id" type varchar(24) using ("active_environment_id"::varchar(24));');
    this.addSql('alter table "designer"."assistant" alter column "active_environment_id" drop not null;');
    this.addSql('alter table "designer"."assistant" add constraint "assistant_active_persona_id_active_environment_id_foreign" foreign key ("active_persona_id", "active_environment_id") references "designer"."persona" ("id", "environment_id") on update cascade on delete set default;');
    this.addSql('alter table "designer"."assistant" add constraint "assistant_active_persona_id_active_environment_id_unique" unique ("active_persona_id", "active_environment_id");');

    this.addSql('alter table "designer"."condition" add column "prompt_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."condition" drop column "prompt";');
    this.addSql('alter table "designer"."condition" add constraint "condition_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set default;');

    this.addSql('alter table "designer"."response_variant" add column "prompt_id" varchar(24) null default null;');
    this.addSql('alter table "designer"."response_variant" drop column "prompt";');
    this.addSql('alter table "designer"."response_variant" add constraint "response_variant_prompt_id_environment_id_foreign" foreign key ("prompt_id", "environment_id") references "designer"."prompt" ("id", "environment_id") on update cascade on delete set default;');
  }

}
