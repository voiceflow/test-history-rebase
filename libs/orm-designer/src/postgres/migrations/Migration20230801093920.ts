import { Migration } from '@mikro-orm/migrations';

export class Migration20230801093920 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."variable" add column "description" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."variable" drop column "description";');
  }
}
