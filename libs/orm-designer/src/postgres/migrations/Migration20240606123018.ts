import { Migration } from '@mikro-orm/migrations';

export class Migration20240606123018 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "designer"."reference" add column "metadata" jsonb null default null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."reference" drop column "metadata";');
  }

}
