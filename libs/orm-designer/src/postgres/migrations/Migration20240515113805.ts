import { Migration } from '@mikro-orm/migrations';

export class Migration20240515113805 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."assistant" drop constraint "assistant_active_persona_id_active_environment_id_foreign";'
    );

    this.addSql(
      'alter table "designer"."assistant" alter column "active_environment_id" type varchar(24) using ("active_environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."assistant" alter column "active_environment_id" set not null;');
    this.addSql(
      'alter table "designer"."assistant" drop constraint "assistant_active_persona_id_active_environment_id_unique";'
    );
    this.addSql('alter table "designer"."assistant" drop column "active_persona_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."assistant" add column "active_persona_id" varchar(24) null default null;');
    this.addSql(
      'alter table "designer"."assistant" alter column "active_environment_id" type varchar(24) using ("active_environment_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."assistant" alter column "active_environment_id" drop not null;');
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_active_environment_id_foreign" foreign key ("active_persona_id", "active_environment_id") references "designer"."persona" ("id", "environment_id") on update cascade on delete set default;'
    );
    this.addSql(
      'alter table "designer"."assistant" add constraint "assistant_active_persona_id_active_environment_id_unique" unique ("active_persona_id", "active_environment_id");'
    );
  }
}
