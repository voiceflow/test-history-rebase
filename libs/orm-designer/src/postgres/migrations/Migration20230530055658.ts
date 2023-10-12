import { Migration } from '@mikro-orm/migrations';

export class Migration20230530055658 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "designer"."function" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "code" varchar(255) not null, "paths" text[] not null, "assistant_id" varchar(255) not null, "created_by_id" int not null, "updated_by_id" int not null, "folder_id" varchar(255) null, constraint "function_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table "designer"."function" add constraint "function_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function" add constraint "function_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function" add constraint "function_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function" add constraint "function_folder_id_foreign" foreign key ("folder_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."flow" drop constraint "flow_created_by_id_foreign";');
    this.addSql('alter table "designer"."flow" drop constraint "flow_updated_by_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_created_by_id_foreign";');
    this.addSql('alter table "designer"."variable" drop constraint "variable_updated_by_id_foreign";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('entity', 'event', 'flow', 'function', 'intent', 'prompt', 'persona', 'response', 'story', 'variable'));"
    );

    this.addSql('alter table "designer"."flow" alter column "created_by_id" type int using ("created_by_id"::int);');
    this.addSql('alter table "designer"."flow" alter column "created_by_id" set not null;');
    this.addSql('alter table "designer"."flow" alter column "updated_by_id" type int using ("updated_by_id"::int);');
    this.addSql('alter table "designer"."flow" alter column "updated_by_id" set not null;');
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."variable" alter column "created_by_id" type int using ("created_by_id"::int);'
    );
    this.addSql('alter table "designer"."variable" alter column "created_by_id" set not null;');
    this.addSql(
      'alter table "designer"."variable" alter column "updated_by_id" type int using ("updated_by_id"::int);'
    );
    this.addSql('alter table "designer"."variable" alter column "updated_by_id" set not null;');
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."condition" alter column "code" type varchar(255) using ("code"::varchar(255));'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "designer"."function" cascade;');

    this.addSql('alter table "designer"."folder" drop constraint if exists "folder_scope_check";');

    this.addSql('alter table "designer"."flow" drop constraint "flow_created_by_id_foreign";');
    this.addSql('alter table "designer"."flow" drop constraint "flow_updated_by_id_foreign";');

    this.addSql('alter table "designer"."variable" drop constraint "variable_created_by_id_foreign";');
    this.addSql('alter table "designer"."variable" drop constraint "variable_updated_by_id_foreign";');

    this.addSql('alter table "designer"."folder" alter column "scope" type text using ("scope"::text);');
    this.addSql(
      "alter table \"designer\".\"folder\" add constraint \"folder_scope_check\" check (\"scope\" in ('entity', 'event', 'flow', 'intent', 'prompt', 'persona', 'response', 'story', 'variable'));"
    );

    this.addSql('alter table "designer"."flow" alter column "created_by_id" type int using ("created_by_id"::int);');
    this.addSql('alter table "designer"."flow" alter column "created_by_id" drop not null;');
    this.addSql('alter table "designer"."flow" alter column "updated_by_id" type int using ("updated_by_id"::int);');
    this.addSql('alter table "designer"."flow" alter column "updated_by_id" drop not null;');
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "designer"."variable" alter column "created_by_id" type int using ("created_by_id"::int);'
    );
    this.addSql('alter table "designer"."variable" alter column "created_by_id" drop not null;');
    this.addSql(
      'alter table "designer"."variable" alter column "updated_by_id" type int using ("updated_by_id"::int);'
    );
    this.addSql('alter table "designer"."variable" alter column "updated_by_id" drop not null;');
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_created_by_id_foreign" foreign key ("created_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."variable" add constraint "variable_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."user" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."condition" alter column "code" type jsonb using ("code"::jsonb);');
  }
}
