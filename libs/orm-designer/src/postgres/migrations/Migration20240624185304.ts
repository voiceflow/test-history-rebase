import { Migration } from '@mikro-orm/migrations';

export class Migration20240624185304 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "designer"."response" add column "smoke_test_random" text null default null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."response" drop column "smoke_test_random";');
  }

}
