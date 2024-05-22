import { Migration } from '@mikro-orm/migrations';

export class Migration20240515112751 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "designer"."response_variant" drop column "json";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."response_variant" add column "json" jsonb null;');
  }

}
