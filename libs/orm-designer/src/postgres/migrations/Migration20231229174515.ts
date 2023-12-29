import { Migration } from '@mikro-orm/migrations';

export class Migration20231229174515 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."entity" alter column "id" type varchar(64) using ("id"::varchar(64));');

    this.addSql(
      'alter table "designer"."required_entity" alter column "entity_id" type varchar(64) using ("entity_id"::varchar(64));'
    );

    this.addSql(
      'alter table "designer"."entity_variant" alter column "entity_id" type varchar(64) using ("entity_id"::varchar(64));'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."entity" alter column "id" type varchar(24) using ("id"::varchar(24));');

    this.addSql(
      'alter table "designer"."required_entity" alter column "entity_id" type varchar(24) using ("entity_id"::varchar(24));'
    );

    this.addSql(
      'alter table "designer"."entity_variant" alter column "entity_id" type varchar(24) using ("entity_id"::varchar(24));'
    );
  }
}
