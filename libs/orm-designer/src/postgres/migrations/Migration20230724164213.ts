import { Migration } from '@mikro-orm/migrations';

export class Migration20230724164213 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."entity" add column "description" varchar(255) null default null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."entity" drop column "description";');
  }
}
