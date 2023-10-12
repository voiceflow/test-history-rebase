import { Migration } from '@mikro-orm/migrations';

export class Migration20230524192356 extends Migration {
  async up(): Promise<void> {
    this.addSql('create schema if not exists "designer";');

    this.addSql(
      'create table "designer"."assistant" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "workspace_id" int not null, constraint "assistant_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."folder" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null, "name" varchar(255) not null, "scope" text check ("scope" in (\'example\')) not null, "parent_id" varchar(255) null, "assistant_id" varchar(255) not null, constraint "folder_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_workspace_id_foreign" foreign key ("workspace_id") references "identity"."workspace" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."folder" add constraint "folder_parent_id_foreign" foreign key ("parent_id") references "designer"."folder" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."folder" add constraint "folder_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."folder" drop constraint "folder_assistant_id_foreign";');

    this.addSql('alter table "designer"."folder" drop constraint "folder_parent_id_foreign";');

    this.addSql('drop table if exists "designer"."assistant" cascade;');

    this.addSql('drop table if exists "designer"."folder" cascade;');

    this.addSql('drop schema "designer";');
  }
}
