import { Migration } from '@mikro-orm/migrations';

export class Migration20240112154323 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."entity_variant" alter column "value" type varchar(320) using ("value"::varchar(320));'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "designer"."entity_variant" alter column "value" type varchar(255) using ("value"::varchar(255));'
    );
  }
}
