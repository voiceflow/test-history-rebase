import { Migration } from '@mikro-orm/migrations';

export class Migration20230614202745 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_story_id_foreign";');

    this.addSql(
      'create table "designer"."flow" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "name" varchar(255) not null, "diagram_id" varchar(255) not null, "status" text check ("status" in (\'to_do\', \'in_progress\', \'complete\')) null default null, "is_enabled" boolean not null, "is_start" boolean not null, "trigger_order" text[] not null, "assignee_id" int not null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null default null, constraint "flow_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table "designer"."flow" add constraint "flow_assignee_id_foreign" foreign key ("assignee_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql('drop table if exists "designer"."story" cascade;');

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('component', 'entity', 'event', 'flow', 'function', 'intent', 'prompt', 'persona', 'response', 'variable'));"
    );

    this.addSql('alter table "designer"."trigger" rename column "story_id" to "flow_id";');
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."trigger" drop constraint "trigger_flow_id_foreign";');

    this.addSql(
      'create table "designer"."story" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "name" varchar(255) not null, "status" text check ("status" in (\'to_do\', \'in_progress\', \'complete\')) null default null, "is_enabled" boolean not null, "is_start" boolean not null, "trigger_order" text[] not null, "assignee_id" int not null, "component_id" varchar(255) null default null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null default null, constraint "story_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table "designer"."story" add constraint "story_assignee_id_foreign" foreign key ("assignee_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."story" add constraint "story_component_id_foreign" foreign key ("component_id") references "designer"."component" ("id") on update cascade on delete set null;'
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

    this.addSql('drop table if exists "designer"."flow" cascade;');

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('entity', 'event', 'component', 'function', 'intent', 'prompt', 'persona', 'response', 'story', 'variable'));"
    );

    this.addSql('alter table "designer"."trigger" rename column "flow_id" to "story_id";');
    this.addSql(
      'alter table "designer"."trigger" add constraint "trigger_story_id_foreign" foreign key ("story_id") references "designer"."story" ("id") on update cascade;'
    );
  }
}
