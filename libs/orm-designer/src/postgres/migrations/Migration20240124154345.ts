import { Migration } from '@mikro-orm/migrations';

export class Migration20240124154345 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."variable" drop constraint if exists "variable_datatype_check";');

    this.addSql('alter table "designer"."variable" alter column "id" type varchar(64) using ("id"::varchar(64));');
    this.addSql('alter table "designer"."variable" alter column "datatype" type text using ("datatype"::text);');
    this.addSql(
      "alter table \"designer\".\"variable\" add constraint \"variable_datatype_check\" check (\"datatype\" in ('any', 'text', 'date', 'image', 'number', 'boolean'));"
    );

    this.addSql(
      'alter table "designer"."event_mapping" alter column "variable_id" type varchar(64) using ("variable_id"::varchar(64));'
    );

    this.addSql('alter table "designer"."entity_variant" alter column "value" type text using ("value"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."variable" drop constraint if exists "variable_datatype_check";');

    this.addSql('alter table "designer"."variable" alter column "id" type varchar(24) using ("id"::varchar(24));');
    this.addSql('alter table "designer"."variable" alter column "datatype" type text using ("datatype"::text);');
    this.addSql(
      "alter table \"designer\".\"variable\" add constraint \"variable_datatype_check\" check (\"datatype\" in ('text', 'number', 'date', 'boolean', 'image'));"
    );

    this.addSql(
      'alter table "designer"."event_mapping" alter column "variable_id" type varchar(24) using ("variable_id"::varchar(24));'
    );

    this.addSql(
      'alter table "designer"."entity_variant" alter column "value" type varchar(320) using ("value"::varchar(320));'
    );
  }
}
