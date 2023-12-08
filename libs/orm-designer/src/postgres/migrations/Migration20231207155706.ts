import { Migration } from '@mikro-orm/migrations';

export class Migration20231207155706 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."assistant" alter column "active_environment_id" type varchar(24) using ("active_environment_id"::varchar(24));'
    );

    this.addSql('alter table "designer"."variable" alter column "description" type text using ("description"::text);');
    this.addSql(
      'alter table "designer"."variable" alter column "default_value" type text using ("default_value"::text);'
    );

    this.addSql(
      'alter table "designer"."persona" alter column "system_prompt" type text using ("system_prompt"::text);'
    );

    this.addSql(
      'alter table "designer"."persona_override" alter column "system_prompt" type text using ("system_prompt"::text);'
    );

    this.addSql('alter table "designer"."intent" alter column "description" type text using ("description"::text);');

    this.addSql('alter table "designer"."function" alter column "code" type text using ("code"::text);');
    this.addSql('alter table "designer"."function" alter column "description" type text using ("description"::text);');

    this.addSql(
      'alter table "designer"."function_variable" alter column "description" type text using ("description"::text);'
    );

    this.addSql(
      'alter table "designer"."flow" alter column "diagram_id" type varchar(24) using ("diagram_id"::varchar(24));'
    );
    this.addSql('alter table "designer"."flow" alter column "description" type text using ("description"::text);');

    this.addSql('alter table "designer"."story" alter column "description" type text using ("description"::text);');

    this.addSql('alter table "designer"."event" alter column "description" type text using ("description"::text);');

    this.addSql('alter table "designer"."entity" alter column "description" type text using ("description"::text);');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "designer"."assistant" alter column "active_environment_id" type varchar(255) using ("active_environment_id"::varchar(255));'
    );

    this.addSql(
      'alter table "designer"."variable" alter column "description" type varchar(255) using ("description"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."variable" alter column "default_value" type varchar(255) using ("default_value"::varchar(255));'
    );

    this.addSql(
      'alter table "designer"."persona" alter column "system_prompt" type varchar(255) using ("system_prompt"::varchar(255));'
    );

    this.addSql(
      'alter table "designer"."persona_override" alter column "system_prompt" type varchar(255) using ("system_prompt"::varchar(255));'
    );

    this.addSql(
      'alter table "designer"."intent" alter column "description" type varchar(255) using ("description"::varchar(255));'
    );

    this.addSql(
      'alter table "designer"."function" alter column "code" type varchar(255) using ("code"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."function" alter column "description" type varchar(255) using ("description"::varchar(255));'
    );

    this.addSql(
      'alter table "designer"."function_variable" alter column "description" type varchar(255) using ("description"::varchar(255));'
    );

    this.addSql(
      'alter table "designer"."flow" alter column "diagram_id" type varchar(255) using ("diagram_id"::varchar(255));'
    );
    this.addSql(
      'alter table "designer"."flow" alter column "description" type varchar(255) using ("description"::varchar(255));'
    );

    this.addSql(
      'alter table "designer"."story" alter column "description" type varchar(255) using ("description"::varchar(255));'
    );

    this.addSql(
      'alter table "designer"."event" alter column "description" type varchar(255) using ("description"::varchar(255));'
    );

    this.addSql(
      'alter table "designer"."entity" alter column "description" type varchar(255) using ("description"::varchar(255));'
    );
  }
}
