import { Migration } from '@mikro-orm/migrations';

export class Migration20230614202328 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."story" drop constraint "story_flow_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_flow_id_foreign";');

    this.addSql('alter table "designer"."flow_mapping" drop constraint "flow_mapping_flow_id_foreign";');

    this.addSql(
      'create table "designer"."component" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "name" varchar(255) not null, "diagram_id" varchar(255) not null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null default null, constraint "component_pkey" primary key ("id"));'
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

    this.addSql('drop table if exists "designer"."flow" cascade;');

    this.addSql('drop table if exists "designer"."flow_mapping" cascade;');

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('entity', 'event', 'component', 'function', 'intent', 'prompt', 'persona', 'response', 'story', 'variable'));"
    );

    this.addSql('alter table "designer"."story" rename column "flow_id" to "component_id";');
    this.addSql(
      'alter table "designer"."story" add constraint "story_component_id_foreign" foreign key ("component_id") references "designer"."component" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."variable" rename column "flow_id" to "component_id";');
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_component_id_foreign" foreign key ("component_id") references "designer"."component" ("id") on update cascade on delete set null;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."story" drop constraint "story_component_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_component_id_foreign";');

    this.addSql('alter table "designer"."component_mapping" drop constraint "component_mapping_component_id_foreign";');

    this.addSql(
      'create table "designer"."flow" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "name" varchar(255) not null, "type" text check ("type" in (\'story\', \'component\')) not null, "diagram_id" varchar(255) not null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null default null, constraint "flow_pkey" primary key ("id"));'
    );
    this.addSql('create index "flow_type_index" on "designer"."flow" ("type");');

    this.addSql(
      'create table "designer"."flow_mapping" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "direction" text check ("direction" in (\'in\', \'out\')) not null, "flow_id" varchar(255) not null, "assistant_id" varchar(255) not null, "in_from" jsonb null, "out_from_id" varchar(255) null default null, "to_id" varchar(255) null default null, constraint "flow_mapping_pkey" primary key ("id"));'
    );
    this.addSql('create index "flow_mapping_direction_index" on "designer"."flow_mapping" ("direction");');

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

    this.addSql(
      'alter table "designer"."flow_mapping" add constraint "flow_mapping_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow_mapping" add constraint "flow_mapping_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow_mapping" add constraint "flow_mapping_out_from_id_foreign" foreign key ("out_from_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."flow_mapping" add constraint "flow_mapping_to_id_foreign" foreign key ("to_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );

    this.addSql('drop table if exists "designer"."component" cascade;');

    this.addSql('drop table if exists "designer"."component_mapping" cascade;');

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('entity', 'event', 'flow', 'function', 'intent', 'prompt', 'persona', 'response', 'story', 'variable'));"
    );

    this.addSql('alter table "designer"."story" rename column "component_id" to "flow_id";');
    this.addSql(
      'alter table "designer"."story" add constraint "story_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."variable" rename column "component_id" to "flow_id";');
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade on delete set null;'
    );
  }
}
