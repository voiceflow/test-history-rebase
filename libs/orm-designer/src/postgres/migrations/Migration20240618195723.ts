import { Migration } from '@mikro-orm/migrations';

export class Migration20240618195723 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."response" add column "draft" boolean null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."response" drop column "draft";');
  }
}
