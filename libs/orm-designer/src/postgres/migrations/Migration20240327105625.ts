import { Migration } from '@mikro-orm/migrations';

export class Migration20240327105625 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_story_id_environment_id_foreign";');

    this.addSql(
      'create table "designer"."workflow" ("id" varchar(24) not null, "environment_id" varchar(24) not null default null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "updated_by_id" int not null, "name" varchar(255) not null, "assistant_id" varchar(24) not null, "created_by_id" int not null, "folder_id" varchar(24) null default null, "status" text check ("status" in (\'to_do\', \'complete\', \'in_progress\')) null default null, "is_start" boolean not null, "diagram_id" varchar(24) not null, "assignee_id" int null default null, "description" text null default null, constraint "workflow_pkey" primary key ("id", "environment_id"));'
    );
    this.addSql('create index "workflow_environment_id_index" on "designer"."workflow" ("environment_id");');
    this.addSql(
      'alter table "designer"."workflow" add constraint "workflow_id_environment_id_unique" unique ("id", "environment_id");'
    );

    this.addSql(
      'alter table "designer"."workflow" add constraint "workflow_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."workflow" add constraint "workflow_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."workflow" add constraint "workflow_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."workflow" add constraint "workflow_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."workflow" add constraint "workflow_assignee_id_foreign" foreign key ("assignee_id") references "identity"."user" ("id") on update cascade on delete set default;'
    );

    this.addSql('drop table if exists "designer"."story" cascade;');

    this.addSql('drop table if exists "designer"."trigger" cascade;');

    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."persona_override" drop constraint if exists "persona_override_model_check";');

    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona\" add constraint \"persona_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-v1', 'claude-v2', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus', 'claude-instant-v1', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."persona_override" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona_override\" add constraint \"persona_override_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-v1', 'claude-v2', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus', 'claude-instant-v1', 'gemini-pro'));"
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "designer"."story" ("id" varchar(24) not null, "environment_id" varchar(24) not null default null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "updated_by_id" int not null, "name" varchar(255) not null, "assistant_id" varchar(24) not null, "created_by_id" int not null, "folder_id" varchar(24) null default null, "status" text check ("status" in (\'to_do\', \'complete\', \'in_progress\')) null default null, "flow_id" varchar(24) null default null, "is_start" boolean not null, "is_enabled" boolean not null, "assignee_id" int null default null, "description" text null default null, "trigger_order" text[] not null, constraint "story_pkey" primary key ("id", "environment_id"));'
    );
    this.addSql('create index "story_environment_id_index" on "designer"."story" ("environment_id");');
    this.addSql(
      'alter table "designer"."story" add constraint "story_id_environment_id_unique" unique ("id", "environment_id");'
    );

    this.addSql(
      'create table "designer"."trigger" ("id" varchar(24) not null, "environment_id" varchar(24) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "updated_by_id" int null default null, "name" varchar(255) not null, "story_id" varchar(24) not null, "target" text check ("target" in (\'event\', \'intent\')) not null, "assistant_id" varchar(24) not null, "event_id" varchar(24) null, "intent_id" varchar(64) null, constraint "trigger_pkey" primary key ("id", "environment_id"));'
    );
    this.addSql('create index "trigger_target_index" on "designer"."trigger" ("target");');
    this.addSql('create index "trigger_environment_id_index" on "designer"."trigger" ("environment_id");');
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_id_environment_id_unique" unique ("id", "environment_id");'
    );

    this.addSql(
      'alter table "designer"."story" add constraint "story_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_folder_id_environment_id_foreign" foreign key ("folder_id", "environment_id") references "designer"."folder" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_flow_id_environment_id_foreign" foreign key ("flow_id", "environment_id") references "designer"."flow" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_assignee_id_foreign" foreign key ("assignee_id") references "identity"."user" ("id") on update cascade on delete set default;'
    );

    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_story_id_environment_id_foreign" foreign key ("story_id", "environment_id") references "designer"."story" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_event_id_environment_id_foreign" foreign key ("event_id", "environment_id") references "designer"."event" ("id", "environment_id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_intent_id_environment_id_foreign" foreign key ("intent_id", "environment_id") references "designer"."intent" ("id", "environment_id") on update cascade on delete cascade;'
    );

    this.addSql('drop table if exists "designer"."workflow" cascade;');

    this.addSql('alter table "designer"."persona" drop constraint if exists "persona_model_check";');

    this.addSql('alter table "designer"."persona_override" drop constraint if exists "persona_override_model_check";');

    this.addSql('alter table "designer"."persona" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona\" add constraint \"persona_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-v1', 'claude-v2', 'claude-instant-v1', 'gemini-pro'));"
    );

    this.addSql('alter table "designer"."persona_override" alter column "model" type text using ("model"::text);');
    this.addSql(
      "alter table \"designer\".\"persona_override\" add constraint \"persona_override_model_check\" check (\"model\" in ('text-davinci-003', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-v1', 'claude-v2', 'claude-instant-v1', 'gemini-pro'));"
    );
  }
}
