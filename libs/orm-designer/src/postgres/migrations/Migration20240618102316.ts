import { Migration } from '@mikro-orm/migrations';

export class Migration20240618102316 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "designer"."reference" drop constraint "reference_environment_id_resource_id_referrer_resource_id_unique";'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "designer"."reference" add constraint "reference_environment_id_resource_id_referrer_resource_id_unique" unique ("environment_id", "resource_id", "referrer_resource_id");'
    );
  }
}
