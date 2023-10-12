import { Migration } from '@mikro-orm/migrations';

export class Migration20230615143303 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "designer"."function_variable" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "name" varchar(255) not null, "description" varchar(255) null default null, "type" text check ("type" in (\'input\', \'output\')) not null, "function_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "function_variable_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "designer"."function_path" ("id" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now(), "deleted_at" timestamptz(0) null default null, "name" varchar(255) not null, "label" varchar(255) null, "function_id" varchar(255) not null, "assistant_id" varchar(255) not null, constraint "function_path_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_function_id_foreign" foreign key ("function_id") references "designer"."function" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function_variable" add constraint "function_variable_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_function_id_foreign" foreign key ("function_id") references "designer"."function" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "designer"."function_path" add constraint "function_path_assistant_id_foreign" foreign key ("assistant_id") references "designer"."assistant" ("id") on update cascade;'
    );

    this.addSql('alter table "designer"."persona" rename column "prompt" to "role";');

    this.addSql('alter table "designer"."intent" add column "description" varchar(255) null default null;');

    this.addSql('alter table "designer"."function" add column "description" varchar(255) null default null;');
    this.addSql('alter table "designer"."function" drop column "paths";');

    this.addSql(
      'alter table "designer"."flow" add column "description" varchar(255) null default null, add column "can_interrupt" boolean not null, add column "repeat_on_resume" boolean not null, add column "quiet_resume" boolean not null, add column "transition" text check ("transition" in (\'discard\', \'pause\')) not null, add column "resume" text check ("resume" in (\'none\', \'response\')) not null, add column "response_id" varchar(255) null default null;'
    );
    this.addSql(
      'alter table "designer"."flow" add constraint "flow_response_id_foreign" foreign key ("response_id") references "designer"."response" ("id") on update cascade on delete set null;'
    );

    this.addSql('alter table "designer"."component" add column "description" varchar(255) null default null;');

    this.addSql(
      "alter table \"designer\".\"variable\" add column \"system\" text check (\"system\" in ('intent_confidence', 'last_response', 'last_utterance', 'sessions', 'timestamp', 'user_id')) null default null;"
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "designer"."function_variable" cascade;');

    this.addSql('drop table if exists "designer"."function_path" cascade;');

    this.addSql('alter table "designer"."flow" drop constraint "flow_response_id_foreign";');

    this.addSql('alter table "designer"."persona" rename column "role" to "prompt";');

    this.addSql('alter table "designer"."intent" drop column "description";');

    this.addSql('alter table "designer"."function" add column "paths" text[] not null;');
    this.addSql('alter table "designer"."function" drop column "description";');

    this.addSql('alter table "designer"."flow" drop column "description";');
    this.addSql('alter table "designer"."flow" drop column "can_interrupt";');
    this.addSql('alter table "designer"."flow" drop column "repeat_on_resume";');
    this.addSql('alter table "designer"."flow" drop column "quiet_resume";');
    this.addSql('alter table "designer"."flow" drop column "transition";');
    this.addSql('alter table "designer"."flow" drop column "resume";');
    this.addSql('alter table "designer"."flow" drop column "response_id";');

    this.addSql('alter table "designer"."component" drop column "description";');

    this.addSql('alter table "designer"."variable" drop column "system";');
  }
}
