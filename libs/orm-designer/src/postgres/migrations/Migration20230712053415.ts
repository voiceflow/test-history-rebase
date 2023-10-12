import { Migration } from '@mikro-orm/migrations';

export class Migration20230712053415 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."variable" drop constraint "variable_component_id_foreign";');

    this.addSql('alter table "designer"."component_mapping" drop constraint "component_mapping_component_id_foreign";');

    this.addSql(
      'create table "designer"."persona_override" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "name" varchar(255) null default null, "model" text check ("model" in (\'gpt_3\', \'gpt_3.5\', \'gpt_4\')) null default null, "temperature" int null default null, "max_length" int null default null, "system_prompt" varchar(255) null default null, "persona_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "persona_override_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."story" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "name" varchar(255) not null, "description" varchar(255) null default null, "status" text check ("status" in (\'to_do\', \'in_progress\', \'complete\')) null default null, "is_enabled" boolean not null, "is_start" boolean not null, "assignee_id" int not null, "trigger_order" text[] not null, "flow_id" varchar(255) null default null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null default null, constraint "story_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_persona_id_foreign" foreign key ("persona_id") references "designer"."persona" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."persona_override" add constraint "persona_override_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."story" add constraint "story_assignee_id_foreign" foreign key ("assignee_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql('drop table if exists "designer"."component" cascade;');

    this.addSql('drop table if exists "designer"."component_mapping" cascade;');

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_persona_id_foreign";');

    this.addSql('alter table "designer"."flow" drop constraint "flow_assignee_id_foreign";');
    this.addSql('alter table "designer"."flow" drop constraint "flow_response_id_foreign";');

    this.addSql('alter table "designer"."trigger" drop constraint "trigger_flow_id_foreign";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('entity', 'event', 'flow', 'function', 'intent', 'prompt', 'persona', 'response', 'story', 'variable'));"
    );

    this.addSql('drop index "designer"."variable_scope_index";');
    this.addSql('alter table "designer"."variable" drop column "scope";');
    this.addSql('alter table "designer"."variable" drop column "component_id";');

    this.addSql('alter table "designer"."persona" add column "system_prompt" varchar(255) not null;');
    this.addSql('alter table "designer"."persona" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "designer"."persona" alter column "name" set not null;');
    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_model_check" check ("model" in (\'gpt_3\', \'gpt_3.5\', \'gpt_4\'));'
    );
    this.addSql('alter table "designer"."persona" alter column "model" set not null;');
    this.addSql('alter table "designer"."persona" alter column "temperature" type int using ("temperature"::int);');
    this.addSql('alter table "designer"."persona" alter column "temperature" set not null;');
    this.addSql('alter table "designer"."persona" alter column "max_length" type int using ("max_length"::int);');
    this.addSql('alter table "designer"."persona" alter column "max_length" set not null;');
    this.addSql('alter table "designer"."persona" drop column "is_override";');
    this.addSql('alter table "designer"."persona" drop column "role";');

    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_persona_id_foreign" foreign key ("persona_id") references "designer"."persona_override" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."function" add column "image" varchar(255) null default null;');

    this.addSql('alter table "designer"."flow" drop column "status";');
    this.addSql('alter table "designer"."flow" drop column "is_enabled";');
    this.addSql('alter table "designer"."flow" drop column "is_start";');
    this.addSql('alter table "designer"."flow" drop column "can_interrupt";');
    this.addSql('alter table "designer"."flow" drop column "repeat_on_resume";');
    this.addSql('alter table "designer"."flow" drop column "quiet_resume";');
    this.addSql('alter table "designer"."flow" drop column "transition";');
    this.addSql('alter table "designer"."flow" drop column "resume";');
    this.addSql('alter table "designer"."flow" drop column "trigger_order";');
    this.addSql('alter table "designer"."flow" drop column "assignee_id";');
    this.addSql('alter table "designer"."flow" drop column "response_id";');

    this.addSql('alter table "designer"."trigger" rename column "flow_id" to "story_id";');
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_story_id_foreign" foreign key ("story_id") references "designer"."story" ("id") on update cascade;'
    );

    this.addSql('alter table "designer"."condition" alter column "code" type jsonb using ("code"::jsonb);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."prompt" drop constraint "prompt_persona_id_foreign";');

    this.addSql('alter table "designer"."trigger" drop constraint "trigger_story_id_foreign";');

    this.addSql(
      'create table "designer"."component" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "name" varchar(255) not null, "description" varchar(255) null default null, "diagram_id" varchar(255) not null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null default null, constraint "component_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."component_mapping" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "direction" text check ("direction" in (\'in\', \'out\')) not null, "component_id" varchar(255) not null, "assistant_id" varchar(255) not null, "in_from" jsonb null, "out_from_id" varchar(255) null default null, "to_id" varchar(255) null default null, constraint "component_mapping_pkey" primary key ("id"));'
    );
    this.addSql('create index "component_mapping_direction_index" on "designer"."component_mapping" ("direction");');

    this.addSql(
      'alter table "designer"."component" add constraint "component_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."component" add constraint "component_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."component" add constraint "component_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."component" add constraint "component_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."component_mapping" add constraint "component_mapping_component_id_foreign" foreign key ("component_id") references "designer"."component" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."component_mapping" add constraint "component_mapping_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."component_mapping" add constraint "component_mapping_out_from_id_foreign" foreign key ("out_from_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."component_mapping" add constraint "component_mapping_to_id_foreign" foreign key ("to_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );

    this.addSql('drop table if exists "designer"."persona_override" cascade;');

    this.addSql('drop table if exists "designer"."story" cascade;');

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."prompt" drop constraint "prompt_persona_id_foreign";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('component', 'entity', 'event', 'flow', 'function', 'intent', 'prompt', 'persona', 'response', 'variable'));"
    );

    this.addSql(
      'alter table "designer"."persona" add column "is_override" boolean not null, add column "role" varchar(255) null default null;'
    );
    this.addSql('alter table "designer"."persona" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "designer"."persona" alter column "name" drop not null;');
    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql(
      'alter table "designer"."persona" add constraint "persona_model_check" check ("model" in (\'gpt_3\', \'gpt_3.5\', \'gpt_4\'));'
    );
    this.addSql('alter table "designer"."persona" alter column "model" drop not null;');
    this.addSql('alter table "designer"."persona" alter column "temperature" type int using ("temperature"::int);');
    this.addSql('alter table "designer"."persona" alter column "temperature" drop not null;');
    this.addSql('alter table "designer"."persona" alter column "max_length" type int using ("max_length"::int);');
    this.addSql('alter table "designer"."persona" alter column "max_length" drop not null;');
    this.addSql('alter table "designer"."persona" drop column "system_prompt";');

    this.addSql(
      'alter table "designer"."prompt" add constraint "prompt_persona_id_foreign" foreign key ("persona_id") references "designer"."persona" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."function" drop column "image";');

    this.addSql(
      'alter table "designer"."flow" add column "status" text check ("status" in (\'to_do\', \'in_progress\', \'complete\')) null default null, add column "is_enabled" boolean not null, add column "is_start" boolean not null, add column "can_interrupt" boolean not null, add column "repeat_on_resume" boolean not null, add column "quiet_resume" boolean not null, add column "transition" text check ("transition" in (\'discard\', \'pause\')) not null, add column "resume" text check ("resume" in (\'none\', \'response\')) not null, add column "trigger_order" text[] not null, add column "assignee_id" int not null, add column "response_id" varchar(255) null default null;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_assignee_id_foreign" foreign key ("assignee_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_response_id_foreign" foreign key ("response_id") references "designer"."response" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."variable" add column "scope" text check ("scope" in (\'global\', \'local\')) not null, add column "component_id" varchar(255) null;'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_component_id_foreign" foreign key ("component_id") references "designer"."component" ("id") on update cascade on delete set null;'
    );
    this.addSql('create index "variable_scope_index" on "designer"."variable" ("scope");');

    this.addSql('alter table "designer"."trigger" rename column "story_id" to "flow_id";');
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."condition" alter column "code" type varchar(255) using ("code"::varchar(255));'
    );
  }
}
