import { Migration } from '@mikro-orm/migrations';

export class Migration20230531172342 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop table if exists "out_flow_mapping" cascade;');

    this.addSql('drop table if exists "in_flow_mapping" cascade;');

    this.addSql(
      'alter table "designer"."flow_mapping" add column "in_from" jsonb null, add column "out_from_id" varchar(255) null default null, add column "out_to_id" varchar(255) null default null;'
    );
    this.addSql(
      'alter table "designer"."flow_mapping" add constraint "flow_mapping_out_from_id_foreign" foreign key ("out_from_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "designer"."flow_mapping" add constraint "flow_mapping_out_to_id_foreign" foreign key ("out_to_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );
    this.addSql('create index "flow_mapping_direction_index" on "designer"."flow_mapping" ("direction");');
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "out_flow_mapping" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "direction" text check ("direction" in (\'in\', \'out\')) not null, "flow_id" varchar(255) not null, "assistant_id" varchar(255) not null, "out_from_id" varchar(255) null, "out_to_id" varchar(255) null, constraint "out_flow_mapping_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "in_flow_mapping" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "direction" text check ("direction" in (\'in\', \'out\')) not null, "flow_id" varchar(255) not null, "assistant_id" varchar(255) not null, "in_from" jsonb not null, "in_to_id" varchar(255) null, constraint "in_flow_mapping_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table "out_flow_mapping" add constraint "out_flow_mapping_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "out_flow_mapping" add constraint "out_flow_mapping_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "out_flow_mapping" add constraint "out_flow_mapping_out_from_id_foreign" foreign key ("out_from_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );
    this.addSql(
      'alter table "out_flow_mapping" add constraint "out_flow_mapping_out_to_id_foreign" foreign key ("out_to_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );

    this.addSql(
      'alter table "in_flow_mapping" add constraint "in_flow_mapping_flow_id_foreign" foreign key ("flow_id") references "designer"."flow" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "in_flow_mapping" add constraint "in_flow_mapping_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "in_flow_mapping" add constraint "in_flow_mapping_in_to_id_foreign" foreign key ("in_to_id") references "designer"."variable" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."flow_mapping" drop constraint "flow_mapping_out_from_id_foreign";');
    this.addSql('alter table "designer"."flow_mapping" drop constraint "flow_mapping_out_to_id_foreign";');

    this.addSql('drop index "designer"."flow_mapping_direction_index";');
    this.addSql('alter table "designer"."flow_mapping" drop column "in_from";');
    this.addSql('alter table "designer"."flow_mapping" drop column "out_from_id";');
    this.addSql('alter table "designer"."flow_mapping" drop column "out_to_id";');
  }
}
