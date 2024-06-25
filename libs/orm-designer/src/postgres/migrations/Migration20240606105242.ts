import { Migration } from '@mikro-orm/migrations';

export class Migration20240606105242 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "designer"."reference_resource" ("environment_id" varchar(24) not null, "id" varchar(24) not null, "type" text check ("type" in (\'node\', \'flow\', \'intent\', \'diagram\', \'response\', \'workflow\')) not null, "metadata" jsonb null default null, "assistant_id" varchar(24) not null, "diagram_id" varchar(24) null default null, "resource_id" varchar(255) not null, constraint "reference_resource_pkey" primary key ("environment_id", "id"));'
    );

    this.addSql(
      'create table "designer"."reference" ("environment_id" varchar(24) not null, "id" varchar(24) not null, "resource_id" varchar(24) not null, "referrer_resource_id" varchar(24) not null, constraint "reference_pkey" primary key ("environment_id", "id"));'
    );

    this.addSql(
      'alter table "designer"."reference_resource" add constraint "reference_resource_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade on delete cascade;'
    );

    this.addSql(
      'alter table "designer"."reference" add constraint "reference_environment_id_resource_id_foreign" foreign key ("environment_id", "resource_id") references "designer"."reference_resource" ("environment_id", "id") on update cascade on delete cascade;'
    );
    this.addSql(
      'alter table "designer"."reference" add constraint "reference_environment_id_referrer_resource_id_foreign" foreign key ("environment_id", "referrer_resource_id") references "designer"."reference_resource" ("environment_id", "id") on update cascade on delete cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."reference" drop constraint "reference_environment_id_resource_id_foreign";');

    this.addSql(
      'alter table "designer"."reference" drop constraint "reference_environment_id_referrer_resource_id_foreign";'
    );

    this.addSql('drop table if exists "designer"."reference_resource" cascade;');

    this.addSql('drop table if exists "designer"."reference" cascade;');
  }
}
