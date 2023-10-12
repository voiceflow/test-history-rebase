import { Migration } from '@mikro-orm/migrations';

export class Migration20230615113904 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "designer"."event" add column "description" varchar(255) null default null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "designer"."event" drop column "description";');
  }
}
